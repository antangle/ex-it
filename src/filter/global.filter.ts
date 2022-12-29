import { VersionMismatchError } from './../exception/version.exception';
import { EndRoomException } from './../exception/occupied.exception';
import { FirebaseException } from './../exception/firebase.exception';
import { ApiResult } from './../types/user.d';
import { TooManyRequestException } from './../exception/bad-request.exception';
import { NoNicknameAvailableException } from './../exception/no-nickname.exception';
import { NotExistsException } from '../exception/not-exist.exception';
import { BadRequestCustomException } from 'src/exception/bad-request.exception';
import { UnauthorizedUserException } from './../exception/unauthorized.exception';
import { UnhandledException } from './../exception/unhandled.exception';
import { DatabaseException, UserExistsException } from './../exception/database.exception';
import { CustomError } from './../exception/custom.exception';
import { OauthHttpException } from './../exception/axios.exception';
import { Catch, ArgumentsHost, HttpStatus, BadRequestException, NotFoundException, LoggerService } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseExceptionFilter } from '@nestjs/core';
import { makeApiResponse } from 'src/functions/util.functions';
import { consts } from 'src/consts/consts';
import { OccupiedException } from 'src/exception/occupied.exception';

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

    if(exception.message) msg = exception.message;

    if(exception instanceof NotFoundException){
      return new NotFoundException()
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
      case FirebaseException:
        if(!msg) msg = consts.SEND_FCM_MESSAGE_ERR_MSG;
        apiResponse = makeApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, null, msg)
        break;
      case OccupiedException:
        if(!msg) msg = consts.ALREADY_OCCUPIED;
        apiResponse = makeApiResponse(HttpStatus.CONFLICT, null, msg)
        break;
      case EndRoomException:
        if(!msg) msg = consts.END_ROOM_ERROR_MSG;
        apiResponse = makeApiResponse(HttpStatus.FORBIDDEN, null, msg)
        break;
      case VersionMismatchError:
        if(!msg) msg = consts.VERSION_MISMATCH;
        apiResponse = makeApiResponse(HttpStatus.UNAUTHORIZED, null, msg)
        break;
      default:
        if(!msg) msg = consts.SERVER_ERROR;
        apiResponse = makeApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, null, msg)
        break;
    }

    if(exception instanceof CustomError){
      this.logger.warn(`errorCode: ${code}${exception.code} \n ${exception.data}`)
    }
    else{
      this.logger.warn(`${exception.stack}`);
    }

    //client request error
    if(apiResponse.code >= 400 && apiResponse.code < 500){
      //log request
      const { method, url, body } = req;
      this.logger.warn(`req: ${method} | ${url} \nbody: ${JSON.stringify(body)}\nres: ${JSON.stringify(apiResponse)}`)
    } 
    //server error
    else{
      //log request
      const { method, url, body } = req;
      this.logger.error(`req: ${method} | ${url} | \nbody: ${JSON.stringify(body)}\nres: ${JSON.stringify(apiResponse)}`)
    }

    res.json(apiResponse);
  }
}