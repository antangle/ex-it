import { MainModule } from './../main/main.module';
import { DataLoggingService } from './../../logger/logger.service';
import { RoomRepository } from './../room/room.repository';
import { FcmModule } from './../fcm/fcm.module';
import { AuthRepository } from 'src/module/auth/auth.repository';
import { UserRepository } from 'src/module/user/user.repository';
import { SetEndpoint } from 'src/guard/endpoint.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from '../auth/auth.module';
import { UtilModule } from '../util/util.module';
import { MyRedisModule } from '../redis/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, CacheModule } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthRepository, UserRepository, RoomRepository]),
    AuthModule,
    MyRedisModule,
    UtilModule,
    FcmModule,
    MainModule
  ],
  controllers: [TestController],
  providers: [
    TestService,
    DataLoggingService
  ]
})
export class TestModule {}
