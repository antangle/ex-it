import { ReviewMapper } from './../../entities/reviewMapper.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UtilService } from './util.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReviewMapper
    ]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
        }
      }
    }),
    HttpModule.register({      
      timeout: 5000,
      maxRedirects: 5,
    })
    
  ],
  providers: [UtilService],
  exports: [UtilService]
})
export class UtilModule {}
