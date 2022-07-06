import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomError } from './custom.exception';
export class JwtAuthException extends CustomError {
    constructor(msg: string, code: number, data?: any) {
      super(msg, code, data);
    }
}