import { ParseIntPipe } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsBoolean, isNumber, IsNumber, IsNumberString, IsString, isString, Max, MaxLength, Min } from 'class-validator';

export class RoomEndDto {
    @IsNumber()
    room_id: number;
    
    //5: 선택하지않음
    @Min(0)
    @Max(5)
    @IsNumber()
    review_mode: number;

    @IsNumber()
    call_time: number;
    
    @IsNumber()
    total_time: number;

    @IsString()
    status: string;

    @IsBoolean()
    continue?: boolean;
}

export class RoomEndDtoGet {
    
}