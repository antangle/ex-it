import { HttpModule } from '@nestjs/axios';
import { FcmService } from './fcm.service';
import { Module } from "@nestjs/common";
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        HttpModule,
        ConfigModule
    ],
    providers: [
        FcmService
    ],
    exports: [
        FcmService
    ]
})
export class FcmModule{}