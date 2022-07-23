import { VerifyCache } from './../../types/user.d';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
      ) {}
  
    async get(key: string): Promise<VerifyCache>{
        return await this.cacheManager.get(key);
    }
    
    async set(key: string, value: any){
        await this.cacheManager.set(key, value);
        return true;
    }
}