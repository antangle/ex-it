import { Transform } from "class-transformer";
import { IsEnum, IsNumber } from "class-validator";
import { Status } from "src/consts/enum";

export class JoinRoomDto {
    @IsEnum(Status)
    status: string;
    
    @Transform(({value}) => {
        return isNaN(value) ? value : parseInt(value);
    })
    @IsNumber()
    room_id: number;
}
