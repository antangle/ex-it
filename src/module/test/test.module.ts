import { AuthRepository } from 'src/module/auth/auth.repository';
import { UserRepository } from 'src/module/user/user.repository';
import { SetEndpoint } from 'src/guard/endpoint.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from '../auth/auth.module';
import { UtilModule } from '../util/util.module';
import { RedisModule } from '../redis/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, CacheModule } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthRepository, UserRepository]),
    AuthModule,
    RedisModule,
    UtilModule,
  ],
  controllers: [TestController],
  providers: [
    TestService
  ]
})
export class TestModule {}
