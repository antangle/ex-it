import { ParseIntPipe } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { isNumber, IsNumber, IsNumberString, isString } from 'class-validator';

export class NumberDto {

    @IsNumberString()
    room_id: number;
    
}
