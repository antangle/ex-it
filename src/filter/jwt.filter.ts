import { JwtException } from '../exception/jwt.exception';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';


@Catch(JwtException)
export class JwtExceptionFilter implements ExceptionFilter {
  catch(exception: JwtException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.
        redirect(`/auth/refresh?refresh_token=${request.body.refresh_token}&email=${request.email}`);
  }
}