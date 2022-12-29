import { IsOptional, IsString } from "class-validator";

export class LeaveDto {
    @IsString()
    roomname: string;

    @IsString()
    nickname: string;

    @IsString()
    peerId: string;

    @IsString()
    status: string;
}

export class LeavedDto {
    @IsString()
    nickname: string;

    @IsString()
    peerId: string;
}
