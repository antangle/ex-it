import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UtilService } from './util.service';

@Module({
  imports: [    
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
    HttpModule
    
  ],
  providers: [UtilService],
  exports: [UtilService]
})
export class UtilModule {}
