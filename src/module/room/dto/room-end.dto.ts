import { Status } from 'src/consts/enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';

export class RoomEndDto {
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
        description: '선택한 리뷰 id. 선택하지 않음은 0으로',
        default: 1
    })
    @Transform(({value}) => {
        return isNaN(value) ? value : parseInt(value);
    })
    @IsNumber()
    review_id: number;

    @ApiProperty({
        description: '통화 시간, 초(s)단위',
        default: 65
    })
    @Transform(({value}) => {
        return isNaN(value) ? value : parseInt(value);
    })
    @IsNumber()
    call_time: number;
    
    @ApiProperty({
        description: '총 대화 시간. 채팅 + 통화 시간 전부 포함, 초(s)단위',
        default: 140
    })
    @Transform(({value}) => {
        return isNaN(value) ? value : parseInt(value);
    })
    @IsNumber()
    total_time: number;

    @ApiProperty({
        description: 'host | speaker | guest',
        default: 'host'
    })
    @IsEnum(Status)
    status: string;

    @ApiProperty({
        description: 'continue: true - 대화방유지 false - 메인으로 이동',
        default: false
    })
    @IsBoolean()
    continue?: boolean;
}