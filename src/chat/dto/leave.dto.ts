import { IsOptional, IsString } from "class-validator";

export class LeaveDto {
    @IsString()
    roomname: string;

    @IsString()
    nickname: string;

    @IsOptional()
    @IsString()
    peerId: string;
}

export class LeavedDto {
    @IsString()
    nickname: string;
}
