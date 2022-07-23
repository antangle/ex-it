export class CustomError extends Error {
  code?: number;
  data?: any;
  constructor(msg: string, code: number, data?: any) {
    super();
    this.message = msg;
    this.code = code;
    this.data = data;
  }
}
