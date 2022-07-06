import { QueryFailedError } from 'typeorm';
import { JwtAuthException } from './../exception/jwt.exception';
import { UnhandledException } from './../exception/unhandled.exception';
import { DatabaseException, UserExistsException } from './../exception/database.exception';
import { CustomError } from './../exception/custom.exception';
import { OauthException } from './../exception/axios.exception';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseExceptionFilter, Reflector } from '@nestjs/core';
import { generateCode, makeApiResponse } from 'src/functions/util.functions';
import consts from 'src/consts/consts';

@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter {

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    let code = req.endpoint;
    let msg = 'something wrong';
    let data;

    if(exception instanceof CustomError){
      console.log(exception.constructor);
      console.log('global error handler: ', (exception as CustomError).data);
    }

    switch(exception.constructor){
      case OauthException:
        code = generateCode(req.endpoint, (exception as OauthException).code);
        msg = (exception as OauthException).message;
        break;       
      case DatabaseException:
        code = generateCode(req.endpoint, (exception as DatabaseException).code);
        msg = (exception as DatabaseException).message;
        break;
      case UnhandledException:
        code = generateCode(req.endpoint, (exception as UnhandledException).code);
        msg = consts.UNHANDLED_EXCEPTION;
        const methodName = (exception as UnhandledException).message;
        console.log(methodName);
        break; 
      case JwtAuthException:
        code = generateCode(req.endpoint, (exception as UnhandledException).code);
        msg = (exception as UnhandledException).message;
        break; 
      case UserExistsException:
        code = generateCode(req.endpoint, (exception as UnhandledException).code);
        msg = (exception as UnhandledException).message;
        data = {
          emailAvailable: false
        };
        break; 
      case CustomError:
        code = generateCode(req.endpoint, (exception as CustomError).code);
        msg = (exception as CustomError).message;
        data = null;
        break;
      default:
        console.log((exception as Error))
    }


    console.log(`code: ${code}`);
    console.log(`msg: ${msg}`);
  

    res.json(makeApiResponse(code, data, msg));
  }
}