import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import path from "path";
import { Inject } from '@nestjs/common/decorators';
import { Logger } from 'typeorm';

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
    private logger: Logger;
    constructor(
        private configService: ConfigService,
    ) {}
    onError(error: any)
    {   
        this.logger.log('warn', `ORM onError: ${error.message}`, error.stack);
    }
    createTypeOrmOptions(): TypeOrmModuleOptions & {timezone: string} {
        return {
            type: "postgres",
            host: this.configService.get<string>('POSTGRES_HOST'),
            port: this.configService.get<number>('POSTGRES_PORT'),
            username: this.configService.get<string>('POSTGRES_USER'),
            password: this.configService.get<string>('POSTGRES_PASSWORD'),
            database: this.configService.get<string>('POSTGRES_DB'),
            poolErrorHandler: this.onError,
            extra: {
                //TODO: poolsize 조정
                poolSize: 35,
                connectionTimeoutMillis: 3000,
            },
            maxQueryExecutionTime: 1000,

            synchronize: false,
            timezone: 'Asia/Seoul',
            logging: this.configService.get<string>('DEVMODE') == 'dev' ? true : false,
            logger: this.logger,
            migrationsRun: false,
            entities: [
                path.join(__dirname, './../entities/*.entity.{ts,js}')
            ],
            migrations: [
                path.join(__dirname, './../migrations/*.{ts,js}')
            ],
            subscribers: [
                path.join(__dirname, './../subscribers/*.{ts,js}')
            ],
            cli: {
                "entitiesDir": './src/entities',
                "migrationsDir": './src/migrations',
                "subscribersDir": './src/subscribers'
            }
        };
    };
}