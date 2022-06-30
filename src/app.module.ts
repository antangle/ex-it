import { ConfigModule } from '@nestjs/config';
import { AppGateway } from './gateway/socket.gateway';
import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MyTypeormModule } from './database/typeorm.module';
import { UserModule } from './module/user/user.module';
import { TestModule } from './module/test/test.module';
import { AuthModule } from './module/auth/auth.module';
import { RedisModule } from './module/redis/redis.module';
import { RoomModule } from './module/room/room.module';
import { UtilModule } from './module/util/util.module';

@Module({ 
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.DEVMODE == 'dev' ? '.env.dev' : '.env'
    }),
    CacheModule.register(),
    MyTypeormModule,
    UserModule,
    TestModule,
    AuthModule,
    RedisModule,
    RoomModule,
    UtilModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppGateway
  ],
}) 
export class AppModule {}