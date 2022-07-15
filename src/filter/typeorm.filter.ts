import { CustomError } from './../exception/custom.exception';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';


@Catch(CustomError)
export class CustomFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {

        const res: Response = host.switchToHttp().getResponse();

        //email already exists.
        res.send(exception.message);
    }
}