import { User } from './../../../entities/user.entity';
import { IsArray, isBoolean, IsBoolean, IsDate, IsNumber, IsOptional, isString, IsString, ValidateNested } from "class-validator";
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import consts from 'src/consts/consts';

export class SearchRoomDto {

    @ApiProperty({
        description: '찾고자 하는 관련 태그. 1개만 선택 가능하다. /room/tag 에서 제공한 tags의 id를 사용한다. 없다면 0을 넣는다.',
        default: 11
    })
    @Transform(({value}) => {
        return isNaN(value) ? value : parseInt(value);
    })
    @IsNumber()
    @IsOptional()
    tag_id?: number = 0;

    @ApiProperty({
        description: '찾고자 하는 방 제목. 일부가 포함된 제목도 모두 탐색한다. 1개만 선택 가능하다. /room/tag 에서 제공한 tags의 id를 사용한다. 없다면 빈 문자열 \"\"을 넣는다.',
        default: '이별'
    })
    @IsString()
    @IsOptional()
    title?: string = '';

    @ApiProperty({
        description: '페이징을 위한 값. 현재 가져올 페이지를 의미한다. 최소 1',
        default: 1
    })
    @Transform(({value}) => {
        return isNaN(value) ? value - 1 : parseInt(value) - 1;
    })
    @IsNumber()
    @IsOptional()
    page?: number = 1;

    @ApiProperty({
        description: '페이징을 위한 값. 한번에 가져올 개체의 양을 의미한다. default 20',
        default: 0
    })
    @Transform(({value}) => {
        return isNaN(value) ? value : parseInt(value);
    })
    @IsNumber()
    @IsOptional()
    take?: number = consts.PAGINATION_TAKE;
}
