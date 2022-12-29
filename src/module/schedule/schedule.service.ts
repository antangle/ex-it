import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AuthRepository } from 'src/module/auth/auth.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserRepository } from 'src/module/user/user.repository';
import { Connection } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { backup } from './backup';

@Injectable()
export class TasksService {

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
    private configService: ConfigService,
  ){}

  @Cron('0 0 * * *')
  backupDb(){
    const username = this.configService.get('POSTGRES_USER');
    const database = this.configService.get('POSTGRES_DB');
    const containerName = this.configService.get('POSTGRES_NAME');

    const date = new Date();
    const currentDate = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`;
    const fileName = `./backup/database-backup${currentDate}.backup`;

    backup(username, database, containerName, fileName, this.logger);
  }

  /* @Cron('0 4 * * *')
  async handleCron() {

      const deleted = await queryRunner.manager.createQueryBuilder()
        .delete()
        .from(User)
        .where('deleted_at IS NOT NULL')
        .andWhere(`deleted_at < NOW() - INTERVAL '4 day'`)
        .returning('*')
        .execute()

      this.logger.log('deleted quit users:', deleted)
    
    }
  } */
}
