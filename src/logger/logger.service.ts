import { RoomTag } from './../entities/roomTag.entity';
import { Room } from './../entities/room.entity';
import { User } from './../entities/user.entity';
import { WINSTON_MODULE_PROVIDER, WinstonLogger } from 'nest-winston';
import { Injectable } from "@nestjs/common";
import { Inject } from '@nestjs/common';
import { consts } from 'src/consts/consts';
import { AuthorizedUser } from 'src/types/user';

@Injectable ()
export class DataLoggingService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private logger: WinstonLogger
    ){}

    log(data: Object | string, logLevel = consts.DATA){
        if(typeof data === 'string'){
            this.logger.log(logLevel, data)
        } else{
            this.logger.log(logLevel, JSON.stringify(data));
        }
    }

/*     makeDataLogs(obj: Object): string {
        let dataString: string = "";
        for(var key in obj){
            dataString += `${key}:${obj[key]}`;
        }
        return dataString;
    } */

    //------------------------auth----------------------------
    login(user: AuthorizedUser | User, type = consts.LOCAL){
        const data = {
            user_id: user.id,
            event_name: this.login.name,
            nickname: user.nickname,
            login_type: type
        };
        this.log(data);
    }

    logout(user: AuthorizedUser){
        const data = {
            user_id: user.id,
            event_name: this.logout.name,
            nickname: user.nickname,
            login_type: user.type
        };
        this.log(data);
    }
    
    signin(user: AuthorizedUser | User, type: string = consts.LOCAL, birth: null | string = null, sex: null | string = null){
        const data = {
            user_id: user.id,
            event_name: this.signin.name,
            nickname: user.nickname,
            login_type: type,
            birth: birth,
            sex: sex,
        };
        this.log(data);
        console.log(data);
    }

    quit(user: AuthorizedUser){
        const data = {
            user_id: user.id,
            event_name: this.quit.name,
            nickname: user.nickname,
            login_type: user.type
        };
        this.log(data);
    }
    
    //------------------------room----------------------------
    room_create(user: AuthorizedUser, room: Room){
        const data = {
            event_name: this.room_create.name,
            user_id: user.id,
            nickname: user.nickname,
            room_id: room.id,
            status: consts.HOST
        };
        this.log(data);
    }
    room_end(user: AuthorizedUser, roomId: number, status: string){
        const data = {
            event_name: this.room_end.name,
            user_id: user.id,
            nickname: user.nickname,
            room_id: roomId,
            status: status
        };
        this.log(data);
    }
    
    room_join(user: AuthorizedUser, room: Room, status: string){
        const data = {
            event_name: this.room_join.name,
            user_id: user.id,
            nickname: user.nickname,
            room_id: room.id,
            status: status
        };
        this.log(data);
    }

    tag(user: AuthorizedUser, room: Room, tags: string[]){
        const data = {
            event_name: this.tag.name,
            user_id: user.id,
            nickname: user.nickname,
            room_id: room.id,
            roomtags: tags
        };
        this.log(data);
    }

    review(user: AuthorizedUser, callTime: number){
        const data = {
            event_name: this.review.name,
            user_id: user.id,
            nickname: user.nickname,
            call_time: callTime
        };
        this.log(data);

    }
}