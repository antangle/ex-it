import { Transform } from 'class-transformer';
import { isNumber, IsNumber, IsNumberString, IsOptional, isString } from 'class-validator';

export class RoomIdDto {

    @Transform(({value}) => {
        return isNaN(value) ? value : parseInt(value);
    })
    @IsNumber()
    room_id: number;
    
}
