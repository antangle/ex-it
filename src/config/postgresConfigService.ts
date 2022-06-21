import { Injectable } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import path from "path";

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: "postgres",
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            synchronize: false,
            logging: true,
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