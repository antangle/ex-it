import { MainModule } from './../main/main.module';
import { DataLoggingService } from './../../logger/logger.service';
import { MyRedisModule } from './../redis/redis.module';
import { UtilModule } from '../util/util.module';
import { AuthRepository } from './auth.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './strategy/local.strategy';
import { UserModule } from '../user/user.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.stategy';
import { UserRepository } from '../user/user.repository';
import { MainService } from '../main/main.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthRepository, UserRepository]),
    UserModule,
    PassportModule,
    UtilModule,
    MyRedisModule,
    MainModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
        }
      }
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    DataLoggingService
  ],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}