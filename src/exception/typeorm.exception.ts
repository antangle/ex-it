import { HttpException, HttpStatus } from '@nestjs/common';
export class QueryFailedException extends Error {
    constructor(msg?: string) {
      super();
    }
}