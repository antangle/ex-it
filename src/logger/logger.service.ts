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
            login_type: type
        };
        this.log(data);
    }

    logout(user: AuthorizedUser){
        const data = {
            user_id: user.id,
            event_name: this.logout.name,
            login_type: user.type
        };
        this.log(data);
    }
    
    signin(user: AuthorizedUser | User, type: string = consts.LOCAL){
        const data = {
            user_id: user.id,
            event_name: this.signin.name,
            login_type: type
        };
        this.log(data);
    }

    quit(user: AuthorizedUser){
        const data = {
            user_id: user.id,
            event_name: this.quit.name,
            login_type: user.type
        };
        this.log(data);
    }
    
    //------------------------room----------------------------
    room_create(user: AuthorizedUser, room: Room){
        const data = {
            event_name: this.room_create.name,
            user_id: user.id,
            room_id: room.id,
            status: consts.HOST
        };
        this.log(data);
    }
    room_end(user: AuthorizedUser, roomId: number, status: string){
        const data = {
            event_name: this.room_end.name,
            user_id: user.id,
            room_id: roomId,
            status: status
        };
        this.log(data);
    }
    
    room_join(user: AuthorizedUser, room: Room, status: string){
        const data = {
            event_name: this.room_join.name,
            user_id: user.id,
            room_id: room.id,
            status: status
        };
        this.log(data);
    }

    keyword(user: AuthorizedUser, room: Room, roomTags: RoomTag[]){
        const data = {
            event_name: this.keyword.name,
            user_id: user.id,
            room_id: room.id,
            keyword: roomTags
        };
        this.log(data);
    }
}