import { User } from 'src/entities/user.entity';
import { AuthRepository } from 'src/module/auth/auth.repository';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserRepository } from 'src/module/user/user.repository';
import { Connection } from 'typeorm';

@Injectable()
export class TasksService {

  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
    private readonly connection: Connection
  ){}
  @Cron('0 4 * * *')
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

      console.log('deleted quit users at 4:00')
      await queryRunner.commitTransaction();
    } catch(err){
        await queryRunner.rollbackTransaction();
        throw(err);
    } finally{
        await queryRunner.release();
    }
  }
}
