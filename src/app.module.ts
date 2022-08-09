import { MyScheduleModule } from './schedule/schedule.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MyTypeormModule } from './database/typeorm.module';
import { UserModule } from './module/user/user.module';
import { TestModule } from './module/test/test.module';
import { AuthModule } from './module/auth/auth.module';
import { RedisModule } from './module/redis/redis.module';
import { UtilModule } from './module/util/util.module';
import { ProfileModule } from './module/profile/profile.module';
import { RoomModule } from './module/room/room.module';
import { ChatModule } from './chat/chat.module';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.DEVMODE == 'dev' ? '.env.dev' : '.env'
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: process.env.DEVMODE === 'dev' ? 'silly': 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('MyApp', { prettyPrint: true }),
          ),
        }),
      ],
    }),
    CacheModule.register(),
    MyTypeormModule,
    UserModule,
    TestModule,
    AuthModule,
    RedisModule,
    RoomModule,
    UtilModule,
    ProfileModule,
    ChatModule,
    MyScheduleModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
}) 
export class AppModule {}