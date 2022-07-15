import { ParseIntPipe } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { isNumber, IsNumber, IsNumberString, isString } from 'class-validator';

export class RoomIdDto {

    @IsNumberString()
    room_id: number;
    
}
