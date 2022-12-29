import { CustomError } from './custom.exception';
export class NotOperationTimeException extends CustomError {
    constructor(msg: string, code: number, data?: any) {
      super(msg, code, data);
    }
}