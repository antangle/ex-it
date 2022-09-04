import { IsOptional, IsString } from "class-validator";

export class PeerJoinDto {
    @IsString()
    roomname: string;    

    @IsString()
    peerId: string;

    @IsString()
    nickname: string;

    @IsString()
    status: string;
}

export class PeerConnectedDto {

    @IsString()
    peerId: string;

    @IsString()
    nickname: string;
}