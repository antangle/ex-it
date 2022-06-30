import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module, CacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis';

@Module({
    imports: [
        CacheModule.registerAsync({
            imports:[ConfigModule],
            inject:[ConfigService],
            useFactory: (configService: ConfigService) => ({
                store: redisStore,
                host: configService.get<string>('REDIS_HOST'),
                port: configService.get<number>('REDIS_PORT')
            })
        })
    ],
    exports: [
        CacheModule
    ]
})
export class RedisModule {}
