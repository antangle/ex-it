import { CustomError } from './custom.exception';
export class UnhandledException extends CustomError {
    constructor(msg: string, code: number, data?: any) {
      super(`unhandled exception in method ${msg}`, code, data);
    }
}