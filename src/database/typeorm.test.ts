import { Injectable } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import path from "path";

@Injectable()
export class TypeOrmTestConfig implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) {}
    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: "postgres",
            host: this.configService.get<string>('POSTGRES_HOST'),
            port: this.configService.get<number>('POSTGRES_PORT'),
            username: this.configService.get<string>('POSTGRES_USER'),
            password: this.configService.get<string>('POSTGRES_PASSWORD'),
            database: this.configService.get<string>('POSTGRES_DB'),
            synchronize: true,
            logging: true,
            logger: 'advanced-console',
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