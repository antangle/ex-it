import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
      ) {}
  
    async get(key: string): Promise<number>{
        return await this.cacheManager.get(key);
    }
    
    async set(key: string, value: number){
        await this.cacheManager.set(key, value);
        return true;
    }
}