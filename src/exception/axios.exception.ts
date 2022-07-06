import { CustomError } from './custom.exception';
export class OauthException extends CustomError {
    constructor(msg: string, code: number, data?: any) {
      super(msg, code, data);
    }
}