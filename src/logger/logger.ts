import { User } from './../entities/user.entity';
import { AuthorizedUser } from './../types/user.d';
import { consts } from "src/consts/consts";
import winston from "winston";

export const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
    data: 7,
};

export const passData = winston.format((info, opts) => {
    if (info.level != consts.DATA) { return false; }
    return info;
});

export class DataLog{
    eventName: string;
    userId: number;
    nickname: string;
    
    constructor(eventName: string){
        this.eventName = eventName;
        
    }

    makeUserDataLog(user: AuthorizedUser | User){
        this.userId = user.id
        this.nickname = user.nickname
    }
}