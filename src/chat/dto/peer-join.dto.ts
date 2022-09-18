import { IsEnum, IsOptional, IsString } from "class-validator";
import { Status } from "src/consts/enum";

export class PeerJoinDto {
    @IsString()
    roomname: string;    

    @IsString()
    peerId: string;

    @IsString()
    nickname: string;

    @IsEnum(Status)
    status: string;
}

export class PeerConnectedDto {

    @IsString()
    peerId: string;

    @IsString()
    nickname: string;
}