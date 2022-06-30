import { CustomError } from './../exception/custom.exception';
import { OauthError } from './../exception/axios.exception';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseExceptionFilter, Reflector } from '@nestjs/core';
import { generateCode } from 'src/functions/util.functions';

@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter {

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    let code = req.endpoint;
    let msg = 'something wrong';
    let data;

    console.log(exception.stack);

    switch(exception.constructor){
        case OauthError:
          code = generateCode(req.endpoint, (exception as OauthError).code);
          msg = (exception as OauthError).message;
          data = (exception as OauthError).data;
          break;
        case CustomError:
          code = generateCode(req.endpoint, (exception as CustomError).code);
          msg = (exception as CustomError).message;
          data = (exception as CustomError).data;
          break;        
    }

    res.json({
      code: code,
      msg: msg,
      data: data
    });
  }
}