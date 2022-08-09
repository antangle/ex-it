import { PipeTransform, Injectable, ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { WsException } from '@nestjs/websockets';
import consts from 'src/consts/consts';
import { WsValidationException } from 'src/exception/ws.exception';

@Injectable()
export class SocketValidationPipe implements PipeTransform<any> {

  constructor() {
    // super(options)
  }

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    try{
      value = JSON.parse(value);
    } catch(err){
      throw new WsValidationException(consts.WS_NOT_JSON_EXCEPTION, consts.VALIDATION_ERROR_CODE, value)
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw errors;
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}