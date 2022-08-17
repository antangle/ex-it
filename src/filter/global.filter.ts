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
    let data: any;
    let msg: string;

    if(exception instanceof CustomError){
      this.logger.warn(`errorCode: ${code}${exception.code}`)
      this.logger.warn(exception);
      if(exception.message) msg = exception.message;
    }
    
    //for api response
    let apiResponse: ApiResult;
    switch(exception.constructor){
      case UnauthorizedUserException:
        if(!msg) msg = consts.UNAUTHORIZED_USER;
        apiResponse = makeApiResponse(HttpStatus.UNAUTHORIZED, null, msg)
        break;
      case OauthHttpException:
        if(!msg) msg = consts.UNAUTHORIZED_USER;
        apiResponse = makeApiResponse(HttpStatus.UNAUTHORIZED, null, msg)
        break;
      case BadRequestCustomException:
        if(!msg) msg = consts.BAD_REQUEST;
        apiResponse = makeApiResponse(HttpStatus.BAD_REQUEST, null, msg)
        break;
      case BadRequestException:
        if(!msg) msg = consts.BAD_REQUEST;
        apiResponse = makeApiResponse(HttpStatus.BAD_REQUEST, null, msg)
        break;
      case NotExistsException:
        if(!msg) msg = consts.TARGET_NOT_EXIST;
        apiResponse = makeApiResponse(HttpStatus.BAD_REQUEST, null, msg)
        break;
      case NoNicknameAvailableException:
        if(!msg) msg = consts.TOO_MANY_TRIES;
        apiResponse = makeApiResponse(HttpStatus.GATEWAY_TIMEOUT, null, msg)
        break;
      case DatabaseException:
        if(!msg) msg = consts.DATABASE_ERROR;
        apiResponse = makeApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, null, msg)
        break;
      case UserExistsException:
        if(!msg) msg = consts.DUPLICATE_ACCOUNT_ERROR;
        apiResponse = makeApiResponse(HttpStatus.BAD_REQUEST, data, msg)
        break;
      case NotFoundException:
        if(!msg) msg = consts.NOT_FOUND;
        apiResponse = makeApiResponse(HttpStatus.NOT_FOUND, null, msg)
        break;
      case TooManyRequestException:
        if(!msg) msg = consts.TOO_MANY_REQUESTS;
        apiResponse = makeApiResponse(HttpStatus.TOO_MANY_REQUESTS, null, msg)
        break;
      case UnhandledException:
        if(!msg) msg = consts.SERVER_ERROR;
        apiResponse = makeApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, null, msg)
        break;
      default:
        if(!msg) msg = consts.SERVER_ERROR;
        apiResponse = makeApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, null, msg)
        break;
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