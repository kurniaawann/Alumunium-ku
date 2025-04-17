import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  Request,
} from '@nestjs/common';
import { ForgotPasswordRequest } from 'src/model/authentication/ForgotPassword.model';
import { AuthenticationLoginRequest } from 'src/model/authentication/login.model';
import { AuthenticationRegisterRequest } from 'src/model/authentication/register.model';
import { VerificationOtpRequest } from 'src/model/authentication/VerificationOtp.model';
import { VerificationOtpForgotPasswordRequest } from 'src/model/authentication/VerificationOtpForgotPassword.model';
import { AuthenticationService } from './authentication.service';

@Controller('/authentication')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() request: AuthenticationRegisterRequest) {
    const result = await this.authenticationService.registerService(request);
    return result;
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() request: AuthenticationLoginRequest) {
    const result = await this.authenticationService.loginService(request);
    return result;
  }

  @Post('/admin/login')
  async loginAdmin(@Body() request: AuthenticationLoginRequest) {
    const result = await this.authenticationService.loginAdminService(request);
    return result;
  }

  @Post('/user/verification')
  @HttpCode(HttpStatus.OK)
  async verificationOtp(
    @Body() request: VerificationOtpRequest,
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
  async resendVerificationOtp(@Body() request: { email: string }) {
    const result =
      await this.authenticationService.sendVerificationOtpService(request);
    return result;
  }
  @Post('/user/forgot-password/verification')
  @HttpCode(HttpStatus.CREATED)
  async verificationForgotPassword(
    @Body() request: VerificationOtpForgotPasswordRequest,
    @Req() req: Request,
  ) {
    const result =
      await this.authenticationService.verificationOtpForgotPassword(
        request,
        req.url,
      );
    return result;
  }

  @Post('/forgot/password')
  @HttpCode(HttpStatus.CREATED)
  async forgotPassword(@Request() req, @Body() request: ForgotPasswordRequest) {
    const userId: string = req.user.user_id;
    const result = await this.authenticationService.forgotPassword(
      request,
      userId,
    );
    return result;
  }
  @HttpCode(HttpStatus.OK)
  @Put('/new/access-token')
  async refreshToken(@Body() request: { refreshToken: string }) {
    const result =
      await this.authenticationService.newAccessTokenService(request);
    return result;
  }

  @Delete('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() request: { refreshToken: string }) {
    const result = await this.authenticationService.logoutService(request);
    return result;
  }
}
