import { RedisService } from './redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module, CacheModule, Global } from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis';

@Global()
@Module({
    imports: [
        CacheModule.registerAsync({
            imports:[ConfigModule],
            inject:[ConfigService],
            useFactory: (configService: ConfigService) => ({
                store: redisStore,
                host: configService.get<string>('REDIS_HOST'),
                port: configService.get<number>('REDIS_PORT'),
                ttl: 330
            })
        })
    ],
    providers: [RedisService],
    exports: [
        RedisService
    ]
})
export class RedisModule {}
