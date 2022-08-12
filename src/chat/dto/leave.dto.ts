import { IsString } from "class-validator";

export class LeaveDto {
    @IsString()
    roomname: string;

    @IsString()
    nickname: string;
}

export class LeavedDto {
    @IsString()
    nickname: string;
}
