import { IsString } from "class-validator";

export class fcmDto {
    @IsString()
    roomname: string

    
}
