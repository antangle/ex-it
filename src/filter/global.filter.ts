import { ApiResult } from './../types/user.d';
import { TooManyRequestException } from './../exception/bad-request.exception';
import { NoNicknameAvailableException } from './../exception/no-nickname.exception';
import { NotExistsException } from '../exception/not-exist.exception';
import { BadRequestCustomException } from 'src/exception/bad-request.exception';
import { UnauthorizedUserException } from './../exception/unauthorized.exception';
import { QueryFailedError } from 'typeorm';
import { JwtAuthException } from './../exception/jwt.exception';
import { UnhandledException } from './../exception/unhandled.exception';
import { DatabaseException, UserExistsException } from './../exception/database.exception';
import { CustomError } from './../exception/custom.exception';
import { OauthHttpException } from './../exception/axios.exception';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, BadRequestException, NotFoundException, Inject, LoggerService } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseExceptionFilter, Reflector } from '@nestjs/core';
import { generateCode, makeApiResponse } from 'src/functions/util.functions';
import { consts } from 'src/consts/consts';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter {
  constructor(private logger: LoggerService){
    super()
  }

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    //for logging
    let code = req.endpoint;
    let data;
    
    //for api response
    let apiResponse: ApiResult;
    switch(exception.constructor){
      case UnauthorizedUserException:
        apiResponse = makeApiResponse(HttpStatus.UNAUTHORIZED, null, consts.UNAUTHORIZED_USER)
        break;
      case OauthHttpException:
        apiResponse = makeApiResponse(HttpStatus.UNAUTHORIZED, null, consts.UNAUTHORIZED_USER)
        break;
      case BadRequestCustomException:
        apiResponse = makeApiResponse(HttpStatus.BAD_REQUEST, null, consts.BAD_REQUEST)
        break;
      case BadRequestException:
        apiResponse = makeApiResponse(HttpStatus.BAD_REQUEST, null, consts.BAD_REQUEST)
        break;
      case NotExistsException:
        apiResponse = makeApiResponse(HttpStatus.BAD_REQUEST, null, consts.TARGET_NOT_EXIST)
        break;
      case NoNicknameAvailableException:
        apiResponse = makeApiResponse(HttpStatus.GATEWAY_TIMEOUT, null, consts.TOO_MANY_TRIES)
        break;
      case DatabaseException:
        apiResponse = makeApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, null, consts.DATABASE_ERROR)
        break;
      case UserExistsException:
        apiResponse = makeApiResponse(HttpStatus.BAD_REQUEST, data, consts.DUPLICATE_ACCOUNT_ERROR)
        break;
      case NotFoundException:
        apiResponse = makeApiResponse(HttpStatus.NOT_FOUND, null, consts.NOT_FOUND)
        break;
      case TooManyRequestException:
        apiResponse = makeApiResponse(HttpStatus.TOO_MANY_REQUESTS, null, consts.TOO_MANY_REQUESTS)
        break;
      case UnhandledException:
        apiResponse = makeApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, null, consts.SERVER_ERROR)
        break;
      case UnhandledException:
        apiResponse = makeApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, null, consts.SERVER_ERROR)
        break;
      default:
        apiResponse = makeApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, null, consts.SERVER_ERROR)
        break;
    }

    if(exception instanceof CustomError){
      this.logger.warn(`errorCode: ${code}${exception.code}`)
      this.logger.warn(exception.data);
    }

    //client request error
    if(apiResponse.code >= 400 && apiResponse.code < 500){
  
      //log request
      const { method, url, body } = req;
      this.logger.warn(`req: ${method} | ${url} | body: ${JSON.stringify(body)}`)
  
      //log response
      this.logger.warn(`res: ${JSON.stringify(apiResponse)}`);
    } 
    //server error
    else{
  
      //log request
      const { method, url, body } = req;
      this.logger.error(`req: ${method} | ${url} | body: ${JSON.stringify(body)}`)
  
      //log response
      this.logger.error(`res: ${JSON.stringify(apiResponse)}`);
    }

    res.json(apiResponse);
  }
}