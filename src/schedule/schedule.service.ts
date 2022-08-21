import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AuthRepository } from 'src/module/auth/auth.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserRepository } from 'src/module/user/user.repository';
import { Connection } from 'typeorm';

@Injectable()
export class TasksService {

  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
    private readonly connection: Connection,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private logger: Logger
  ){}
  /* @Cron('0 4 * * *')
  async handleCron() {
    const queryRunner = this.connection.createQueryRunner();
    try{
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const deleted = await queryRunner.manager.createQueryBuilder()
        .delete()
        .from(User)
        .where('deleted_at IS NOT NULL')
        .andWhere(`deleted_at < NOW() - INTERVAL '4 day'`)
        .returning('*')
        .execute()

      this.logger.log('deleted quit users:', deleted)
      await queryRunner.commitTransaction();
    } catch(err){
        await queryRunner.rollbackTransaction();
        throw(err);
    } finally{
        await queryRunner.release();
    }
  } */
}
