import { ConfigService } from '@nestjs/config';
import { Inject, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from '@nestjs/config'; 
import { TypeOrmConfig } from './typeorm.service';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useClass: TypeOrmConfig,
            inject: [ConfigService]
        })
    ]
})

export class MyTypeormModule{}