import { HttpException, HttpStatus } from '@nestjs/common';
export class JwtException extends HttpException {
    msg: string;
    constructor(msg?: string) {
      super(msg, HttpStatus.UNAUTHORIZED);
      this.msg = msg;
    }
}