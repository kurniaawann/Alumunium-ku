import { StringResource } from 'src/StringResource/string.resource';
import { z, ZodType } from 'zod';
// pastikan pathnya sesuai

export class AuthenticationValidation {
  static readonly REGISTER: ZodType = z.object({
    name: z
      .string({
        required_error: StringResource.ERROR_MESSAGES_VALIDATE.NAME_REQUIRED,
      })
      .trim()
      .min(5, {
        message: StringResource.ERROR_MESSAGES_VALIDATE.NAME_MIN_LENGTH,
      })
      .max(50, {
        message: StringResource.ERROR_MESSAGES_VALIDATE.NAME_MAX_LENGTH,
      }),

    email: z
      .string({
        required_error: StringResource.ERROR_MESSAGES_VALIDATE.EMAIL_REQUIRED,
      })
      .email({ message: StringResource.ERROR_MESSAGES_VALIDATE.EMAIL_FORMAT }),

    noHandphone: z
      .string({
        required_error: StringResource.ERROR_MESSAGES_VALIDATE.PHONE_REQUIRED,
      })
      .regex(/^08/, {
        message: StringResource.ERROR_MESSAGES_VALIDATE.PHONE_FORMAT,
      })
      .min(10, {
        message: StringResource.ERROR_MESSAGES_VALIDATE.PHONE_MIN_LENGTH,
      })
      .max(15, {
        message: StringResource.ERROR_MESSAGES_VALIDATE.PHONE_MAX_LENGTH,
      }),

    password: z
      .string({
        required_error:
          StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_REQUIRED,
      })
      .min(8, {
        message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_MIN_LENGTH,
      })
      .regex(/[a-zA-Z]/, {
        message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_LETTERS,
      })
      .regex(/[0-9]/, {
        message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_NUMBERS,
      })
      .regex(/[^a-zA-Z0-9]/, {
        message:
          StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_SPECIAL_CHARACTERS,
      }),
  });

  static readonly LOGIN: ZodType = z.object({
    email: z
      .string({
        required_error: StringResource.ERROR_MESSAGES_VALIDATE.EMAIL_REQUIRED,
      })
      .email({ message: StringResource.ERROR_MESSAGES_VALIDATE.EMAIL_FORMAT }),

    password: z
      .string({
        required_error:
          StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_REQUIRED,
      })
      .min(8, {
        message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_MIN_LENGTH,
      })
      .regex(/[a-zA-Z]/, {
        message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_LETTERS,
      })
      .regex(/[0-9]/, {
        message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_NUMBERS,
      })
      .regex(/[^a-zA-Z0-9]/, {
        message:
          StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_SPECIAL_CHARACTERS,
      }),
  });

  static readonly VERIFICATIONCODEOTP: ZodType = z.object({
    email: z
      .string({
        required_error: StringResource.ERROR_MESSAGES_VALIDATE.EMAIL_REQUIRED,
      })
      .email({ message: StringResource.ERROR_MESSAGES_VALIDATE.EMAIL_FORMAT }),
    codeOtp: z
      .string({
        required_error:
          StringResource.ERROR_MESSAGES_VALIDATE.CODE_OTP_REQUIRED,
      })
      .min(6, {
        message: StringResource.ERROR_MESSAGES_VALIDATE.CODE_OTP_LENGTH,
      })
      .max(6, {
        message: StringResource.ERROR_MESSAGES_VALIDATE.CODE_OTP_LENGTH,
      })
      .regex(/^\d{6}$/, {
        message: StringResource.ERROR_MESSAGES_VALIDATE.CODE_OTP_FORMAT,
      }),

    // codeOtp: z
    //   .number({
    //     required_error:
    //       StringResource.ERROR_MESSAGES_VALIDATE.CODE_OTP_REQUIRED,
    //   })
    //   .int({ message: StringResource.ERROR_MESSAGES_VALIDATE.CODE_OTP_INTEGER })
    //   .min(6, {
    //     message: StringResource.ERROR_MESSAGES_VALIDATE.CODE_OTP_LENGTH,
    //   })
    //   .max(6, {
    //     message: StringResource.ERROR_MESSAGES_VALIDATE.CODE_OTP_LENGTH,
    //   }),
  });

  static readonly RESENDVERIFICATIONCODEOTP: ZodType = z.object({
    email: z
      .string({
        required_error: StringResource.ERROR_MESSAGES_VALIDATE.EMAIL_REQUIRED,
      })
      .email({ message: StringResource.ERROR_MESSAGES_VALIDATE.EMAIL_FORMAT }),
  });
  static readonly FORGOTPASSWORD: ZodType = z.object({
    oldPassword: z
      .string({
        required_error:
          StringResource.ERROR_MESSAGES_VALIDATE.OLD_PASSWORD_REQUIRED,
      })
      .min(8, {
        message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_MIN_LENGTH,
      })
      .regex(/[a-zA-Z]/, {
        message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_LETTERS,
      })
      .regex(/[0-9]/, {
        message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_NUMBERS,
      })
      .regex(/[^a-zA-Z0-9]/, {
        message:
          StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_SPECIAL_CHARACTERS,
      }),
    newPassword: z
      .string({
        required_error:
          StringResource.ERROR_MESSAGES_VALIDATE.NEW_PASSWORD_REQUIRED,
      })
      .min(8, {
        message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_MIN_LENGTH,
      })
      .regex(/[a-zA-Z]/, {
        message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_LETTERS,
      })
      .regex(/[0-9]/, {
        message: StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_NUMBERS,
      })
      .regex(/[^a-zA-Z0-9]/, {
        message:
          StringResource.ERROR_MESSAGES_VALIDATE.PASSWORD_SPECIAL_CHARACTERS,
      }),
  });
  static readonly VERIFICATIONFORGOTPASSWORD: ZodType = z.object({
    email: z
      .string({
        required_error: StringResource.ERROR_MESSAGES_VALIDATE.EMAIL_REQUIRED,
      })
      .email({ message: StringResource.ERROR_MESSAGES_VALIDATE.EMAIL_FORMAT }),
    codeOtp: z
      .number({
        required_error:
          StringResource.ERROR_MESSAGES_VALIDATE.CODE_OTP_REQUIRED,
      })
      .int(),
    // .min(6, { message: StringResource.ERROR_MESSAGES_VALIDATE.CODE_OTP_LENGTH })
    // .max(6, { message: StringResource.ERROR_MESSAGES_VALIDATE.CODE_OTP_LENGTH })
  });

  static readonly REFRESHTOKEN: ZodType = z.object({
    refreshToken: z.string({
      message: StringResource.ERROR_MESSAGES_VALIDATE.REFRESHTOKEN_TIPE,
      required_error:
        StringResource.ERROR_MESSAGES_VALIDATE.REFRESHTOKEN_REQUIRED,
    }),
  });
}
