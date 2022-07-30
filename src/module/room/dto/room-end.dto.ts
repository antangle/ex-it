import { ParseIntPipe } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsBoolean, isNumber, IsNumber, IsNumberString, IsString, isString, Max, MaxLength, Min } from 'class-validator';

export class RoomEndDto {
    @Transform(({value}) => {
        return isNaN(value) ? value : parseInt(value);
    })
    @IsNumber()
    room_id: number;
    
    //5: 선택하지않음
    @Min(0)
    @Max(5)
    @Transform(({value}) => {
        return isNaN(value) ? value : parseInt(value);
    })
    @IsNumber()
    review_mode: number;

    @Transform(({value}) => {
        return isNaN(value) ? value : parseInt(value);
    })
    @IsNumber()
    call_time: number;
    
    @Transform(({value}) => {
        return isNaN(value) ? value : parseInt(value);
    })
    @IsNumber()
    total_time: number;

    @IsString()
    status: string;

    @IsBoolean()
    continue?: boolean;
}

export class RoomEndDtoGet {
    
}