import { UnauthorizedResponse, BadRequestResponse, InternalServerErrorResponse } from 'src/response/response.dto';
import { ApiResult } from './../types/user.d';
import { RoomTag } from './../entities/roomTag.entity';
import { JwtAuthGuard } from './../guard/jwtAuth.guard';
import { apiHeaderOptions } from './../consts/objects';
import { applyDecorators, SetMetadata, Type, UseGuards } from '@nestjs/common';
import { SetEndpoint } from 'src/guard/endpoint.guard';
import { ApiHeader, ApiBearerAuth, ApiUnauthorizedResponse, ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse } from '@nestjs/swagger';

export function SetJwtAuth() {
  return applyDecorators(
    ApiHeader(apiHeaderOptions),
    ApiBearerAuth('access_token'),
    UseGuards(JwtAuthGuard)
  );
}

export function ApiResponses(okResponse: Type<unknown> | Function | [Function] | string) {
  return applyDecorators(
    ApiOkResponse({
      type: okResponse
    }),
    ApiUnauthorizedResponse({
      type: UnauthorizedResponse
    }),
    ApiBadRequestResponse({
      type: BadRequestResponse
    }),
    ApiInternalServerErrorResponse({
      type: InternalServerErrorResponse
    })
  );
}


export function SetCode(endpoint: number) {
  return applyDecorators(
    SetMetadata('endpoint', endpoint),
    UseGuards(SetEndpoint),
  );
}

export function generateCode(endpoint: number, code: number): number{
    return +(endpoint.toString() + code.toString());
}


export function makeApiResponse(code: number, data?: any, msg?: string): ApiResult{
  let res: ApiResult = {
    msg: msg,
    code: code,
  };
  if(data){
    if(data.hasOwnProperty('tokens')){
      let { tokens, ...payload } = data;
      res.data = payload;
      res.tokens = tokens;
      return res;
    }
    else res.data = data;
  }
  return res;
}

export function parseReview(reviews: any[]){
  try{
      let data = [];
      for(let i=1; i<reviewMapperArray.length; ++i){
          data.push({
              title: reviewMapperArray[i],
              review_mode: i,
              count: 0
          })
      }
      if(reviews[0].mode != null){
          reviews.map(review => {
              var idx: number = +review.mode - 1
              data[idx].count = review.count;                    
          })
      }
      return data;
  } catch(err){
      throw err;
  }
}

export const reviewMapperArray = [
  '이 배열은 review 테이블의 mode를 해당 string으로 매핑하는 배열입니다.',
  '시원하게 쏴대는',
  '재밌게 말하는',
  '공감을 잘 하는',
  '인사이트가 넘치는',
  '잘 경청하는'
]

export function parseArrayToRoomTags(tags: Array<number>, roomId: number):RoomTag[]{
  const data = [];
  tags.map(x => data.push({
      room: roomId,
      tag: x
  }))
  return data;        
}