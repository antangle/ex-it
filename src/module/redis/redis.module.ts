import { RedisService } from './redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module, Global } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { consts } from 'src/consts/consts';

@Global()
@Module({
    imports: [
        RedisModule.forRootAsync({
            imports:[ConfigModule],
            inject:[ConfigService],
            useFactory: (configService: ConfigService) => ({
                config: { 
                    host: configService.get<string>('REDIS_HOST'),
                    port: configService.get<number>('REDIS_PORT'),
                    ttl: consts.ROOM_CACHE_TTL
                },
            })
        }),/* 
        CacheModule.registerAsync({
            imports:[ConfigModule],
            inject:[ConfigService],
            useFactory: (configService: ConfigService) => ({
                store: redisStore,
                host: configService.get<string>('REDIS_HOST'),
                port: configService.get<number>('REDIS_PORT'),
                ttl: 180
            })
        }) */
    ],
    providers: [RedisService],
    exports: [
        RedisService
    ]
})
export class MyRedisModule {}
