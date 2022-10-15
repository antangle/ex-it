import { LeaveDto } from './../../chat/dto/leave.dto';
import { PeerJoinDto } from './../../chat/dto/peer-join.dto';
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
        const payload = await this.redis.smembers(key);
        this.logger.verbose(payload);
        const peers = [];
        if(payload){
            payload.map(value => {
                peers.push(JSON.parse(value));
            });
        }
        this.logger.verbose(peers);
        return peers;
    }

    async setRoomPeerCache(data: PeerJoinDto){
        const {roomname, peerId, nickname, status} = data;
        this.logger.verbose(`...saving cache...\nkey: ${roomname} value: ${JSON.stringify(data)}`);
        const payload = JSON.stringify({peerId, nickname, status})
        await this.redis.sadd(roomname, payload);
        return true;
    }

    async removeRoomPeerCache(data: LeaveDto){
        const {roomname, peerId, nickname, status} = data;
        this.logger.verbose(`...removing cache...\nkey: ${roomname} value: ${JSON.stringify(data)}`);
        const payload = JSON.stringify({peerId, nickname, status})
        await this.redis.srem(roomname, payload);
        return true;
    }

    async removeRoomKey(roomname: string){
        this.logger.verbose(`...unlinking key...\nkey: ${roomname}`);
        await this.redis.unlink(roomname);
    }

    async setRoomSpeakerCache(roomId: number, userId: number){
        this.logger.verbose(`...saving speaker cache...\nkey: ${roomId} value: ${userId}`);
        await this.redis.set(roomId.toString(), userId, 'ex', consts.SPEAKER_TTL);
        return true;
    }

    async removeRoomSpeakerCache(roomId: number){
        this.logger.verbose(`...removing speaker cache...\nkey: ${roomId}`);
        await this.redis.del(roomId.toString());
        return true;
    }

    async getRoomSpeakerCache(roomId: number){
        this.logger.verbose(`...getting speaker cache...\nkey: ${roomId}`);
        const userId = await this.redis.get(roomId.toString());
        return +userId;
    }
}