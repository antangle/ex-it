import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { isNumber, IsNumber, IsNumberString, IsOptional, isString } from 'class-validator';

export class RoomIdDto {

    @ApiProperty({
        description: '해당 방의 id',
        default: 1
    })
    @Transform(({value}) => {
        return isNaN(value) ? value : parseInt(value);
    })
    @IsNumber()
    room_id: number;
    
}
