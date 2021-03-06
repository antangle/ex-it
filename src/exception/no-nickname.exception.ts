import { CustomError } from './custom.exception';
export class NoNicknameAvailableException extends CustomError {
    constructor(msg: string, code: number, data?: any) {
      super(msg, code, data);
    }
}