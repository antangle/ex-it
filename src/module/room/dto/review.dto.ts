import { ParseIntPipe } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { isNumber, IsNumber, IsNumberString, isString, Max, MaxLength, Min } from 'class-validator';

export class ReviewDto {
    @IsNumber()
    room_id: number;

    //host user
    @IsNumber()
    host_id: number;
    
    //5: 선택하지않음
    @Min(0)
    @Max(5)
    @IsNumber()
    review_id: number;
}
