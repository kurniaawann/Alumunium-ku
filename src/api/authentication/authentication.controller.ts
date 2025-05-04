import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
} from '@nestjs/common';
import {
  accessTokenDto,
  ChangepasswordDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResendVerificationCodeOtpDto,
  VerificationCodeOtpDto,
  VerificationForgotPasswordDto,
} from 'src/DTO/dto.authentication';
import { AuthenticationService } from './authentication.service';

@Controller('/authentication')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() request: RegisterDto) {
    const result = await this.authenticationService.registerService(request);
    return result;
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() request: LoginDto) {
    const result = await this.authenticationService.loginService(request);
    return result;
  }

  @Post('/user/verification')
  @HttpCode(HttpStatus.OK)
  async verificationOtp(
    @Body() request: VerificationCodeOtpDto,
    @Req() req: Request,
  ) {
    const result = await this.authenticationService.verificationUserService(
      request,
      req.url,
    );

    return result;
  }
  @Post('/send/otp')
  @HttpCode(HttpStatus.CREATED)
  async resendVerificationOtp(@Body() request: ResendVerificationCodeOtpDto) {
    const result =
      await this.authenticationService.sendVerificationOtpService(request);
    return result;
  }

  @Post('/user/forgot-password/verification')
  @HttpCode(HttpStatus.CREATED)
  async verificationForgotPassword(
    @Body() request: VerificationForgotPasswordDto,
    @Req() req: Request,
  ) {
    const result =
      await this.authenticationService.verificationOtpForgotPassword(
        request,
        req.url,
      );
    return result;
  }

  @Post('/change/password')
  @HttpCode(HttpStatus.CREATED)
  async changePassword(@Request() req, @Body() request: ChangepasswordDto) {
    const userId: string = req.user.user_id;
    const result = await this.authenticationService.changePassword(
      request,
      userId,
    );
    return result;
  }

  @Delete('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() request: accessTokenDto) {
    const result = await this.authenticationService.logoutService(request);
    return result;
  }

  @Post('/forgot/password')
  @HttpCode(HttpStatus.CREATED)
  async forgotPassword(@Request() req, @Body() request: ForgotPasswordDto) {
    const userId: string = req.user.user_id;
    const result = await this.authenticationService.forgotPasswordService(
      request,
      userId,
    );

    return result;
  }
}
