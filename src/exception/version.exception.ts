import { CustomError } from './custom.exception';
export class VersionMismatchError extends CustomError {
    constructor(msg: string, code: number, data?: any) {
      super(msg, code, data);
    }
}