import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(BadRequestException, HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof HttpException) {
      const responseBody = exception.getResponse();
      let message = 'Terjadi kesalahan';

      if (typeof responseBody === 'string') {
        message = responseBody;
      } else if (Array.isArray(responseBody['message'])) {
        message = responseBody['message'][0]; // ambil pesan pertama dari list
      } else if (typeof responseBody['message'] === 'string') {
        message = responseBody['message'];
      }

      response.status(exception.getStatus()).json({
        status_code: exception.getStatus(),
        message: message,
      });
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message || 'Internal Server Error',
      });
    }
  }
}
