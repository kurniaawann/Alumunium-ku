import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { StringResource } from 'src/StringResource/string.resource';

export class RegisterDto {
  @IsNotEmpty({
    message: StringResource.ERROR_MESSAGES_VALIDATE.NAME_REQUIRED,
  })
  @MinLength(5, {
    message: StringResource.ERROR_MESSAGES_VALIDATE.NAME_MIN_LENGTH,
  })
  @MaxLength(50, {
    message: StringResource.ERROR_MESSAGES_VALIDATE.NAME_MAX_LENGTH,
  })
  name: string;

  @IsNotEmpty({
    message: StringResource.ERROR_MESSAGES_VALIDATE.EMAIL_REQUIRED,
  })
  @IsEmail(
    {},
    {
      message: StringResource.ERROR_MESSAGES_VALIDATE.EMAIL_FORMAT,
    },
  )
  email: string;

  @IsNotEmpty({
    message: StringResource.ERROR_MESSAGES_VALIDATE.PHONE_REQUIRED,
  })
  @Matches(/^08/, {
    message: StringResource.ERROR_MESSAGES_VALIDATE.PHONE_FORMAT,
  })
  @MinLength(10, {
    message: StringResource.ERROR_MESSAGES_VALIDATE.PHONE_MIN_LENGTH,
  })
  @MaxLength(15, {
    message: StringResource.ERROR_MESSAGES_VALIDATE.PHONE_MAX_LENGTH,
  })
  noHandphone: string;

  @IsNotEmpty({
    message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_REQUIRED,
  })
  @MinLength(8, {
    message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_MIN_LENGTH,
  })
  @Matches(/[a-zA-Z]/, {
    message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_LETTERS,
  })
  @Matches(/[0-9]/, {
    message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_NUMBERS,
  })
  @Matches(/[^a-zA-Z0-9]/, {
    message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_SPECIAL_CHARACTERS,
  })
  password: string;
}

export class LoginDto {
  @IsNotEmpty({
    message: StringResource.ERROR_MESSAGES_VALIDATE.EMAIL_REQUIRED,
  })
  @IsEmail({}, { message: StringResource.ERROR_MESSAGES_VALIDATE.EMAIL_FORMAT })
  email: string;

  @IsNotEmpty({
    message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_REQUIRED,
  })
  @MinLength(8, {
    message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_MIN_LENGTH,
  })
  @Matches(/[a-zA-Z]/, {
    message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_LETTERS,
  })
  @Matches(/[0-9]/, {
    message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_NUMBERS,
  })
  @Matches(/[^a-zA-Z0-9]/, {
    message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_SPECIAL_CHARACTERS,
  })
  password: string;
}

export class VerificationCodeOtpDto {
  @IsNotEmpty({
    message: StringResource.ERROR_MESSAGES_VALIDATE.EMAIL_REQUIRED,
  })
  @IsEmail({}, { message: StringResource.ERROR_MESSAGES_VALIDATE.EMAIL_FORMAT })
  @Transform(({ value }) => value?.trim())
  email: string;

  @IsNotEmpty({
    message: StringResource.ERROR_MESSAGES_VALIDATE.CODE_OTP_REQUIRED,
  })
  @Length(6, 6, {
    message: StringResource.ERROR_MESSAGES_VALIDATE.CODE_OTP_LENGTH,
  })
  @Matches(/^\d{6}$/, {
    message: StringResource.ERROR_MESSAGES_VALIDATE.CODE_OTP_FORMAT,
  })
  @Transform(({ value }) => value?.trim())
  codeOtp: string;
}

export class ResendVerificationCodeOtpDto {
  @IsNotEmpty({
    message: StringResource.ERROR_MESSAGES_VALIDATE.EMAIL_REQUIRED,
  })
  @IsEmail({}, { message: StringResource.ERROR_MESSAGES_VALIDATE.EMAIL_FORMAT })
  email: string;
}

export class ForgotPasswordDto {
  @IsNotEmpty({
    message: StringResource.ERROR_MESSAGES_VALIDATE.OLD_PASSWORD_REQUIRED,
  })
  @MinLength(8, {
    message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_MIN_LENGTH,
  })
  @Matches(/[a-zA-Z]/, {
    message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_LETTERS,
  })
  @Matches(/[0-9]/, {
    message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_NUMBERS,
  })
  @Matches(/[^a-zA-Z0-9]/, {
    message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_SPECIAL_CHARACTERS,
  })
  @Transform(({ value }) => value?.trim())
  oldPassword: string;

  @IsNotEmpty({
    message: StringResource.ERROR_MESSAGES_VALIDATE.NEW_PASSWORD_REQUIRED,
  })
  @MinLength(8, {
    message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_MIN_LENGTH,
  })
  @Matches(/[a-zA-Z]/, {
    message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_LETTERS,
  })
  @Matches(/[0-9]/, {
    message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_NUMBERS,
  })
  @Matches(/[^a-zA-Z0-9]/, {
    message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_SPECIAL_CHARACTERS,
  })
  @Transform(({ value }) => value?.trim())
  newPassword: string;
}

export class VerificationForgotPasswordDto {
  @IsNotEmpty({
    message: StringResource.ERROR_MESSAGES_VALIDATE.EMAIL_REQUIRED,
  })
  @IsEmail({}, { message: StringResource.ERROR_MESSAGES_VALIDATE.EMAIL_FORMAT })
  @Transform(({ value }) => value?.trim())
  email: string;

  @IsNotEmpty({
    message: StringResource.ERROR_MESSAGES_VALIDATE.CODE_OTP_REQUIRED,
  })
  @IsInt({ message: StringResource.ERROR_MESSAGES_VALIDATE.CODE_OTP_FORMAT })
  @Min(100000, {
    message: StringResource.ERROR_MESSAGES_VALIDATE.CODE_OTP_LENGTH,
  })
  codeOtp: number;
}

export class accessTokenDto {
  @IsNotEmpty({
    message: StringResource.ERROR_MESSAGES_VALIDATE.ACCESS_TOKEN_REQUIRED,
  })
  @IsString({
    message: StringResource.ERROR_MESSAGES_VALIDATE.ACCESS_TOKEN_TIPE,
  })
  accessToken: string;
}
