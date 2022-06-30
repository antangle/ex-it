import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { SetEndpoint } from 'src/guard/endpoint.guard';

export function SetCode(endpoint: number) {
  return applyDecorators(
    SetMetadata('endpoint', endpoint),
    UseGuards(SetEndpoint),
  );
}

export function generateCode(endpoint: number, code: number): number{
    return +(endpoint.toString() + code.toString());
}

export function makeApiResponse(code: number, data?: any, msg?: string){
    return {
        msg: msg,
        code: code,
        data: data
    }
}