import { SetEndpoint } from 'src/guard/endpoint.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from '../auth/auth.module';
import { UtilModule } from '../util/util.module';
import { RedisModule } from '../redis/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, CacheModule } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { TestTable } from 'src/entities/test.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestTable]),
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
