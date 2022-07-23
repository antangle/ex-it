import { CustomError } from './custom.exception';
export class BadRequestCustomException extends CustomError {
    constructor(msg: string, code: number, data?: any) {
      super(msg, code, data);
    }
}

export class UnauthorizedTokenException extends CustomError {
    constructor(msg: string, code: number, data?: any) {
      super(msg, code, data);
    }
}

export class TooManyRequestException extends CustomError {
    constructor(msg: string, code: number, data?: any) {
      super(msg, code, data);
    }
}

