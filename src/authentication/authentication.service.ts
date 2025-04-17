import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { TokenService } from 'src/jwt/jwt.service';
import { OtpVerificationRateLimitMiddleware } from 'src/middleware/LimitValidateOtp.middleware';
import { ForgotPasswordRequest } from 'src/model/authentication/ForgotPassword.model';
import { AuthenticationLoginRequest } from 'src/model/authentication/login.model';
import { AuthenticationRegisterRequest } from 'src/model/authentication/register.model';
import { VerificationOtpRequest } from 'src/model/authentication/VerificationOtp.model';
import { VerificationOtpForgotPasswordRequest } from 'src/model/authentication/VerificationOtpForgotPassword.model';
import { RabbitMqService } from 'src/rabbitMq/rabbitmq.service';
import { StringResource } from 'src/StringResource/string.resource';
import { generateOTP } from 'src/utils/generate.otp';
import { v4 as uuid } from 'uuid';
import { Logger } from 'winston';
import { AuthenticationValidation } from './authentication.validation';

@Injectable()
export class AuthenticationService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private readonly rabbitMqService: RabbitMqService,
    private readonly otpVerificationMiddleware: OtpVerificationRateLimitMiddleware,
    private tokenService: TokenService,
  ) {
    this.rabbitMqService.producer(StringResource.QUEUE_NAME.REGISTER_QUEUE);
    this.rabbitMqService.producer(
      StringResource.QUEUE_NAME.RESEND_CODE_OTP_QUEUE,
    );
  }

  async registerService(
    request: AuthenticationRegisterRequest,
  ): Promise<object> {
    this.logger.info(
      `${StringResource.SUCCESS_MESSAGES_TRIGGER_FUNCTION.SUCCESS_TRIGGER_FUNCTION_REGISTER_SERVICE} ${request.name}`,
    );
    const registerRequest: AuthenticationRegisterRequest =
      this.validationService.validate(
        AuthenticationValidation.REGISTER,
        request,
      );

    // Melakukan pengecekan duplikasi email
    const checkEmail = await this.prismaService.user.findUnique({
      where: {
        email: registerRequest.email,
      },
    });

    if (checkEmail) {
      this.logger.warn(
        `${StringResource.FAILURE_MESSAGES_AUTHENTICATION.EMAIL_ALREADY_USED} ${request.email}`,
      );
      throw new BadRequestException(
        StringResource.FAILURE_MESSAGES_AUTHENTICATION.EMAIL_ALREADY_USED,
      );
    }

    // Melakukan pengecekan duplikasi no handphone
    const checkNoHandphone = await this.prismaService.user.findUnique({
      where: {
        noHandphone: registerRequest.noHandphone,
      },
    });

    if (checkNoHandphone) {
      this.logger.warn(
        `${StringResource.FAILURE_MESSAGES_AUTHENTICATION.PHONE_ALREADY_USED} ${registerRequest.email}`,
      );
      throw new BadRequestException(
        StringResource.FAILURE_MESSAGES_AUTHENTICATION.PHONE_ALREADY_USED,
      );
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const generateUserId: string = `user-${uuid()}`;
    // Buat User Baru
    await this.prismaService.user.create({
      data: {
        userId: generateUserId,
        ...registerRequest,
      },
    });

    this.logger.info(
      `${StringResource.SUCCESS_MESSAGES_AUTHENTICATION.REGISTRATION_SUCCESS} ${registerRequest.name}`,
    );

    const generateCodeOtp: string = generateOTP();

    const dataQueue = {
      name: registerRequest.name,
      email: registerRequest.email,
      codeOtp: generateCodeOtp,
    };

    const getIdUser = await this.prismaService.user.findUnique({
      where: {
        email: registerRequest.email,
      },
      select: {
        userId: true,
      },
    });

    const createAt: Date = new Date();
    const expires: Date = new Date(createAt.getTime() + 5 * 60 * 1000);
    const userId: string = getIdUser.userId;

    //Insert code otp
    await this.prismaService.otp.create({
      data: {
        userId: userId,
        otpCode: generateCodeOtp,
        createdAtOtp: createAt,
        expiresAtOtp: expires,
      },
    });

    await this.prismaService.balance.create({
      data: {
        balanceId: `balance_id-${uuid()}`,
        userId: generateUserId,
        balanceEditBy: '',
        totalBalance: 0,
      },
    });

    // Kirim pesan ke queue
    this.rabbitMqService.sendMessage(
      StringResource.QUEUE_NAME.REGISTER_QUEUE,
      JSON.stringify(dataQueue),
    );

    return {
      statusCode: HttpStatus.CREATED,
      message:
        StringResource.SUCCESS_MESSAGES_AUTHENTICATION.REGISTRATION_SUCCESS,
    };
  }

  async loginService(request: AuthenticationLoginRequest): Promise<object> {
    this.logger.info(
      `${StringResource.SUCCESS_MESSAGES_TRIGGER_FUNCTION.SUCCESS_TRIGGER_FUNCTION_LOGIN_SERVICE} ${request.email}`,
    );
    const loginRequest: AuthenticationLoginRequest =
      this.validationService.validate(AuthenticationValidation.LOGIN, request);

    // Megambil data user
    const user = await this.prismaService.user.findUnique({
      where: {
        email: loginRequest.email,
      },
    });

    // Periksa apakah email ditemukan
    if (!user) {
      this.logger.warn(
        `${StringResource.FAILURE_MESSAGES_AUTHENTICATION.INVALID_CREDENTIALS} ${loginRequest.email}`,
      );
      throw new UnauthorizedException(
        StringResource.FAILURE_MESSAGES_AUTHENTICATION.INVALID_CREDENTIALS,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    // Periksa apakah password sesuai
    if (!isPasswordValid) {
      this.logger.warn(
        `${StringResource.FAILURE_MESSAGES_AUTHENTICATION.INVALID_CREDENTIALS} ${loginRequest.email}`,
      );
      throw new UnauthorizedException(
        StringResource.FAILURE_MESSAGES_AUTHENTICATION.INVALID_CREDENTIALS,
      );
    }

    // Melakukan pengambilan data email yang sudah di verifikasi
    const checkVerification = await this.prismaService.user.findUnique({
      where: {
        email: loginRequest.email,
      },
      select: { isVerified: true },
    });

    // Periksa apakah email sudah di verifikasi
    if (!checkVerification.isVerified) {
      this.logger.warn(
        `${StringResource.FAILURE_MESSAGES_AUTHENTICATION.ACCOUNT_NOT_VERIFIED} ${loginRequest.email}`,
      );
      throw new ForbiddenException(
        StringResource.FAILURE_MESSAGES_AUTHENTICATION.ACCOUNT_NOT_VERIFIED,
      );
    }

    // return access token and refresh token;
    const payload = { user_id: user.userId, role: user.role };
    const accessToken = this.tokenService.generateAccessToken(payload);

    this.logger.info(
      `${StringResource.SUCCESS_MESSAGES_AUTHENTICATION.LOGIN_SUCCESS} ${loginRequest.email}`,
    );
    return {
      data: {
        accessToken,
      },
    };
  }

  async loginAdminService(
    request: AuthenticationLoginRequest,
  ): Promise<object> {
    this.logger.info(
      `${StringResource.SUCCESS_MESSAGES_TRIGGER_FUNCTION.SUCCESS_TRIGGER_FUNCTION_LOGIN_SERVICE} ${request.email}`,
    );
    const loginRequest: AuthenticationLoginRequest =
      this.validationService.validate(AuthenticationValidation.LOGIN, request);

    // Megambil data user
    const user = await this.prismaService.user.findUnique({
      where: {
        email: loginRequest.email,
      },
    });

    // Periksa apakah email ditemukan
    if (!user) {
      this.logger.warn(
        `${StringResource.FAILURE_MESSAGES_AUTHENTICATION.INVALID_CREDENTIALS} ${loginRequest.email}`,
      );
      throw new UnauthorizedException(
        StringResource.FAILURE_MESSAGES_AUTHENTICATION.INVALID_CREDENTIALS,
      );
    }

    if (user.role !== 'admin') {
      this.logger.warn(
        `${StringResource.FAILURE_MESSAGES_AUTHENTICATION.FORBIDDEN_ACCESS} ${loginRequest.email}`,
      );
      throw new ForbiddenException(
        StringResource.FAILURE_MESSAGES_AUTHENTICATION.FORBIDDEN_ACCESS,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    // Periksa apakah password sesuai
    if (!isPasswordValid) {
      this.logger.warn(
        `${StringResource.FAILURE_MESSAGES_AUTHENTICATION.INVALID_CREDENTIALS} ${loginRequest.email}`,
      );
      throw new UnauthorizedException(
        StringResource.FAILURE_MESSAGES_AUTHENTICATION.INVALID_CREDENTIALS,
      );
    }

    // Melakukan pengambilan data email yang sudah di verifikasi
    const checkVerification = await this.prismaService.user.findUnique({
      where: {
        email: loginRequest.email,
      },
      select: { isVerified: true },
    });

    // Periksa apakah email sudah di verifikasi
    if (!checkVerification.isVerified) {
      this.logger.warn(
        `${StringResource.FAILURE_MESSAGES_AUTHENTICATION.ACCOUNT_NOT_VERIFIED} ${loginRequest.email}`,
      );
      throw new ForbiddenException(
        StringResource.FAILURE_MESSAGES_AUTHENTICATION.ACCOUNT_NOT_VERIFIED,
      );
    }

    // return access token and refresh token;
    const payload = { user_id: user.userId, role: user.role };
    const accessToken = this.tokenService.generateAccessToken(payload);

    this.logger.info(
      `${StringResource.SUCCESS_MESSAGES_AUTHENTICATION.LOGIN_SUCCESS} ${loginRequest.email}`,
    );
    return {
      data: {
        accessToken,
      },
    };
  }

  async verificationUserService(
    request: VerificationOtpRequest,
    path: string,
  ): Promise<object> {
    this.logger.info(
      `${StringResource.SUCCESS_MESSAGES_TRIGGER_FUNCTION.SUCCESS_TRIGGER_FUNCTION_VERIFICATION_SERVICE} ${request.email}`,
    );
    const verificationUser: VerificationOtpRequest =
      this.validationService.validate(
        AuthenticationValidation.VERIFICATIONCODEOTP,
        request,
      );

    const getIdUser = await this.prismaService.user.findUnique({
      where: {
        email: verificationUser.email,
      },
      select: {
        userId: true,
      },
    });
    //Melakukan pengambilan data email yang sudah di verifikasi
    const checkVerification = await this.prismaService.user.findUnique({
      where: {
        email: verificationUser.email,
      },
      select: { isVerified: true },
    });

    //Melakukan pengecekan apakah email sudah terdaftar?
    if (!checkVerification) {
      this.logger.warn(
        `${StringResource.FAILURE_MESSAGES_AUTHENTICATION.EMAIL_NOT_REGISTERED} ${verificationUser.email}`,
      );
      throw new NotFoundException(
        StringResource.FAILURE_MESSAGES_AUTHENTICATION.EMAIL_NOT_REGISTERED,
      );
    }

    //melakukan pengecekan apakah email sudah di verifikasi?
    if (checkVerification.isVerified) {
      this.logger.warn(
        `${StringResource.FAILURE_MESSAGES_AUTHENTICATION.ACCOUNT_ALREADY_VERIFIED} ${verificationUser.email}`,
      );
      throw new ForbiddenException(
        StringResource.FAILURE_MESSAGES_AUTHENTICATION.ACCOUNT_ALREADY_VERIFIED,
      );

      //jika belum masuk kesini
    } else {
      //Mengambil User id

      const userOtp = verificationUser.codeOtp;

      console.log(userOtp.toString());

      //Melakukan pengecekan apakah OTP ada di database
      const checkOtpVerification = await this.prismaService.otp.findFirst({
        where: {
          userId: getIdUser.userId,
          otpCode: userOtp.toString(),
        },
      });

      //Melakukan pengecekan ketika OTP tidak ada di database
      if (!checkOtpVerification) {
        this.logger.warn(
          `${StringResource.FAILURE_MESSAGES_AUTHENTICATION.OTP_INVALID_OR_EXPIRED}. ${verificationUser.email}`,
        );
        throw new BadRequestException(
          StringResource.FAILURE_MESSAGES_AUTHENTICATION.OTP_INVALID_OR_EXPIRED,
        );
      }

      const currentTime = new Date();

      // Periksa apakah waktu sekarang sudah melewati waktu kedaluwarsa
      if (currentTime > new Date(checkOtpVerification.expiresAtOtp)) {
        this.logger.warn(
          `${StringResource.FAILURE_MESSAGES_AUTHENTICATION.OTP_EXPIRED}. ${verificationUser.codeOtp}`,
        );
        throw new BadRequestException(
          StringResource.FAILURE_MESSAGES_AUTHENTICATION.OTP_EXPIRED,
        );
      }

      //reset limit input code OTP
      this.otpVerificationMiddleware.resetAttempts(request.email, path);

      //Melakukan update status verifikasi
      await this.prismaService.user.update({
        where: {
          userId: getIdUser.userId,
        },
        data: {
          isVerified: true,
        },
      });

      await this.prismaService.otp.delete({
        where: {
          userId: checkOtpVerification.userId,
        },
      });
    }

    return {
      statusCode: HttpStatus.CREATED,
      message:
        StringResource.SUCCESS_MESSAGES_AUTHENTICATION.VERIFICATION_SUCCESS,
    };
  }

  async sendVerificationOtpService(request: {
    email: string;
  }): Promise<object> {
    this.logger.info(
      `${StringResource.SUCCESS_MESSAGES_TRIGGER_FUNCTION.SUCCESS_TRIGGER_FUNCTION_RESEND_VERIFICATION_SERVICE} ${JSON.stringify(request.email)}`,
    );

    // Validasi email
    this.validationService.validate(
      AuthenticationValidation.RESENDVERIFICATIONCODEOTP,
      request,
    );

    // Periksa apakah email terdaftar dan verifikasi statusnya
    const checkVerification = await this.prismaService.user.findUnique({
      where: {
        email: request.email, // Pastikan properti `email` digunakan dengan benar
      },
      select: {
        isVerified: true,
        userId: true, // Ambil userId sekaligus untuk efisiensi
        name: true,
      },
    });

    if (!checkVerification) {
      this.logger.warn(
        `${StringResource.FAILURE_MESSAGES_AUTHENTICATION.EMAIL_NOT_REGISTERED} ${request.email}`,
      );
      throw new NotFoundException(
        StringResource.FAILURE_MESSAGES_AUTHENTICATION.EMAIL_NOT_REGISTERED,
      );
    }

    // Cek OTP yang sebelumnya dibuat
    const checkOtpVerification = await this.prismaService.otp.findFirst({
      where: {
        userId: checkVerification.userId,
      },
    });

    if (checkOtpVerification) {
      await this.prismaService.otp.delete({
        where: {
          userId: checkOtpVerification.userId,
        },
      });
    }

    //create code Otp
    const generateCodeOtp: string = generateOTP();
    const createAt: Date = new Date();
    const expires: Date = new Date(createAt.getTime() + 5 * 60 * 1000);
    const userId: string = checkVerification.userId;
    // Buat kode OTP baru
    await this.prismaService.otp.create({
      data: {
        userId: userId,
        otpCode: generateCodeOtp,
        createdAtOtp: createAt,
        expiresAtOtp: expires,
      },
    });

    const dataQueue = {
      name: checkVerification.name,
      email: request.email,
      codeOtp: generateCodeOtp,
    };

    // Kirim pesan ke queue
    this.rabbitMqService.sendMessage(
      StringResource.QUEUE_NAME.RESEND_CODE_OTP_QUEUE,
      JSON.stringify(dataQueue),
    );

    return {
      statusCode: HttpStatus.CREATED,
      message:
        StringResource.SUCCESS_MESSAGES_AUTHENTICATION
          .RESEND_VERIFICATION_SUCCESS,
    };
  }

  async forgotPassword(
    request: ForgotPasswordRequest,
    userId: string,
  ): Promise<object> {
    // Validate request
    const forgotPasswordRequest: ForgotPasswordRequest =
      this.validationService.validate(
        AuthenticationValidation.FORGOTPASSWORD,
        request,
      );

    // Find user
    const user = await this.prismaService.user.findUnique({
      where: { userId: userId },
      select: { userId: true, isVerified: true, password: true },
    });

    if (!user) {
      this.logger.warn(
        StringResource.FAILURE_MESSAGES_AUTHENTICATION.EMAIL_NOT_REGISTERED,
      );
      throw new NotFoundException(
        StringResource.FAILURE_MESSAGES_AUTHENTICATION.EMAIL_NOT_REGISTERED,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      forgotPasswordRequest.oldPassword,
      user.password,
    );

    if (!isPasswordValid) {
      this.logger.warn(
        `${StringResource.FAILURE_MESSAGES_AUTHENTICATION.OLD_PASSWORD_IS_WRONG} `,
      );
      throw new UnauthorizedException(
        StringResource.FAILURE_MESSAGES_AUTHENTICATION.OLD_PASSWORD_IS_WRONG,
      );
    }

    if (
      forgotPasswordRequest.newPassword == forgotPasswordRequest.oldPassword
    ) {
      throw new BadRequestException(
        StringResource.FAILURE_MESSAGES_AUTHENTICATION.PASSWORD_SAME,
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      forgotPasswordRequest.newPassword,
      10,
    );

    // Update password
    await this.prismaService.user.update({
      where: { userId: user.userId },
      data: { password: hashedPassword },
    });

    return {
      statusCode: HttpStatus.CREATED,
      message:
        StringResource.SUCCESS_MESSAGES_AUTHENTICATION.PASSWORD_CHANGED_SUCCESS,
    };
  }

  async verificationOtpForgotPassword(
    request: VerificationOtpForgotPasswordRequest,
    path: string,
  ): Promise<object> {
    // Validasi request
    const verificationRequest: VerificationOtpForgotPasswordRequest =
      this.validationService.validate(
        AuthenticationValidation.VERIFICATIONFORGOTPASSWORD,
        request,
      );

    // Ambil user berdasarkan email
    const getUser = await this.prismaService.user.findUnique({
      where: {
        email: verificationRequest.email,
      },
      select: {
        userId: true,
        role: true,
      },
    });

    if (!getUser) {
      throw new NotFoundException(
        StringResource.FAILURE_MESSAGES_AUTHENTICATION.EMAIL_NOT_REGISTERED,
      );
    }

    // Cek verifikasi OTP
    const checkOtpVerification = await this.prismaService.otp.findFirst({
      where: {
        otpCode: verificationRequest.codeOtp.toString(),
        userId: getUser.userId,
      },
    });

    console.log(checkOtpVerification);
    if (!checkOtpVerification) {
      this.logger.warn(
        `${StringResource.FAILURE_MESSAGES_AUTHENTICATION.OTP_INVALID_OR_EXPIRED}. ${verificationRequest.email}`,
      );
      throw new BadRequestException(
        StringResource.FAILURE_MESSAGES_AUTHENTICATION.OTP_INVALID_OR_EXPIRED,
      );
    }

    const currentTime = new Date();

    // Periksa apakah waktu sekarang sudah melewati waktu kedaluwarsa OTP
    if (currentTime > new Date(checkOtpVerification.expiresAtOtp)) {
      this.logger.warn(
        `${StringResource.FAILURE_MESSAGES_AUTHENTICATION.OTP_EXPIRED}. ${verificationRequest.codeOtp}`,
      );
      throw new BadRequestException(
        StringResource.FAILURE_MESSAGES_AUTHENTICATION.OTP_EXPIRED,
      );
    }

    //reset limit input code OTP
    this.otpVerificationMiddleware.resetAttempts(request.email, path);

    await this.prismaService.otp.delete({
      where: {
        userId: checkOtpVerification.userId,
      },
    });

    const payload = { user_id: getUser.userId, role: getUser.role };
    const accessToken = this.tokenService.generateAccessToken(payload);

    return {
      statusCode: HttpStatus.CREATED,
      message:
        StringResource.SUCCESS_MESSAGES_AUTHENTICATION
          .VERIFICATION_OTP_FORGOT_PASSWORD_SUCCESS,
      data: {
        accessToken,
      },
    };
  }

  async newAccessTokenService(request: { refreshToken: string }) {
    this.validationService.validate(
      AuthenticationValidation.REFRESHTOKEN,
      request,
    );

    // Periksa apakah refresh token ada di database
    await this.prismaService.authentication.findUnique({
      where: { refreshToken: request.refreshToken },
    });

    // Verifikasi refresh token
    const payload = this.tokenService.verifyRefreshToken(request.refreshToken);

    // Hasilkan access token baru
    const accessToken = this.tokenService.generateAccessToken(payload);

    return {
      data: {
        accessToken,
      },
    };
  }

  async logoutService(request: { refreshToken: string }) {
    this.validationService.validate(
      AuthenticationValidation.REFRESHTOKEN,
      request,
    );

    // Periksa apakah refresh token ada di database
    await this.prismaService.authentication.findUnique({
      where: { refreshToken: request.refreshToken },
    });

    await this.prismaService.authentication.delete({
      where: { refreshToken: request.refreshToken },
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: StringResource.SUCCESS_MESSAGES_AUTHENTICATION.LOGOUT_SUCCESS,
    };
  }
}
