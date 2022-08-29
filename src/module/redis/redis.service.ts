import { VerifyCache } from './../../types/user.d';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { consts } from 'src/consts/consts';

@Injectable()
export class RedisService {
    constructor(
        @InjectRedis() private readonly redis: Redis,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger
    ) {}

    async getPhoneVerificationCache(key: string): Promise<VerifyCache>{
        const data = await this.redis.get(key);
        if(!data) return null;
        const parsedData = JSON.parse(data);
        this.logger.verbose(parsedData);
        return parsedData;
    }

    async setPhoneVerificationCache(key: string, value: VerifyCache){
        this.logger.verbose(`...saving cache...\nkey: ${key} value: ${value}`);
        await this.redis.set(key, JSON.stringify(value), 'ex', consts.PHONE_VERIFY_TTL);
        return true;
    }

    async getRoomPeerCache(key: string): Promise<string[]>{
        this.logger.verbose(key);
        return await this.redis.smembers(key);
    }
    
    async setRoomPeerCache(roomname: string, peerId: string){
        this.logger.verbose(`...saving cache...\nkey: ${roomname} value: ${peerId}`);
        await this.redis.sadd(roomname, peerId);
        return true;
    }

    async removeRoomPeerCache(roomname: string, peerId: string){
        this.logger.verbose(`...removing cache...\nkey: ${roomname} value: ${peerId}`);
        await this.redis.srem(roomname, peerId);
        return true;
    }
}