import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators'
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { Connection, QueryRunner } from 'typeorm';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly connection: Connection) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {

    const req = context.switchToHttp().getRequest();
    const queryRunner: QueryRunner = await this.dbInit();

    req.queryRunner = queryRunner;

    return next.handle().pipe(
        catchError(async (err) => {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            
            throw err

        }),
        tap(async () => {
          await queryRunner.commitTransaction();
          await queryRunner.release();
        }),
    );
  }

  private async dbInit(): Promise<QueryRunner> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect()
    await queryRunner.startTransaction();

    return queryRunner;
  }
}