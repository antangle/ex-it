import { AuthModule } from './../auth/auth.module';
import { UtilModule } from './../util/util.module';
import { FcmController } from './fcm.controller';
import { HttpModule } from '@nestjs/axios';
import { FcmService } from './fcm.service';
import { Module } from "@nestjs/common";
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        HttpModule,
        ConfigModule,
        UtilModule,
        AuthModule
    ],
    providers: [
        FcmService
    ],
    controllers: [
        FcmController
    ],
    exports: [
        FcmService
    ]
})
export class FcmModule{}