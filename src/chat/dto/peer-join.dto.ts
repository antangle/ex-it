import { IsString } from "class-validator";

export class PeerJoinDto {
    @IsString()
    roomname: string;    

    @IsString()
    peerId: string;

    @IsString()
    nickname: string;
}

export class PeerConnectedDto {

    @IsString()
    peerId: string;

    @IsString()
    nickname: string;
}