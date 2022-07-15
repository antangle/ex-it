import { CustomError } from './custom.exception';
export class NotExistsException extends CustomError {
    constructor(msg: string, code: number, data?: any) {
      super(msg, code, data);
    }
}