import { Status } from 'src/consts/enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, isNumber, IsNumber, IsNumberString, IsOptional, isString } from 'class-validator';
import { consts } from 'src/consts/consts';

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

export class makeReviewDto {

    @ApiProperty({
        description: '해당 방의 id',
        default: 1
    })
    @Transform(({value}) => {
        return isNaN(value) ? value : parseInt(value);
    })
    @IsNumber()
    room_id: number;
    
    @ApiProperty({
        description: `${consts.HOST} | ${consts.SPEAKER} | ${consts.GUEST}`,
        default: `${consts.HOST}`
    })
    @IsEnum(Status)
    status: string;

    @ApiProperty({
        description: '선택한 리뷰 id. 선택하지 않음은 0으로',
        default: 1
    })
    @IsNumber()
    review_id: number;

    @ApiProperty({
        description: '통화 시간, 초(s)단위',
        default: 65
    })
    @IsNumber()
    call_time: number;
    
    @ApiProperty({
        description: '총 대화 시간. 채팅 + 통화 시간 전부 포함, 초(s)단위',
        default: 140
    })
    @IsNumber()
    total_time: number;

}
