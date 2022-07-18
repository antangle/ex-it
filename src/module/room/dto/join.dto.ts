import { IsEnum, IsNumber } from "class-validator";
import { Status } from "src/consts/enum";

export class JoinRoomDto {
    @IsEnum(Status)
    status: string;
    
    @IsNumber()
    room_id: number;
}
