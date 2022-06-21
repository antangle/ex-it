import { ConfigModule } from '@nestjs/config';
import { AppGateway } from './gateway/socket.gateway';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MyTypeormModule } from './config/typeorm.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { TestModule } from './test/test.module';

@Module({ 
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.DEVMODE == 'dev' ? '.env.dev' : '.env'
    }),
    MyTypeormModule,
    UserModule,
    TestModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppGateway
  ],
}) 
export class AppModule {}