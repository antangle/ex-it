import { IsString } from "class-validator";

export class MessageDto {
    @IsString()
    roomname: string;

    @IsString()
    msg: string;

    @IsString()
    nickname: string;
}
