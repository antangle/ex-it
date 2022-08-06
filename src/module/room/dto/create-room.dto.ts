import { User } from './../../../entities/user.entity';
import { IsArray, IsBoolean, IsDate, IsInt, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {

    @ApiProperty({
        description: '채팅방 제목. 최대 길이 20자',
        default: '파혼해버렸습니다. 잘한건가요?'
    })
    @MaxLength(20)
    @IsString()
    title: string;    
    
    @ApiProperty({
        description: '하드코어 유무',
        default: true
    })
    @IsBoolean()
    hardcore: boolean;

    @ApiProperty({
        description: '옵저버 유무',
        default: true
    })
    @IsBoolean()
    observer: boolean;
    
    @ApiHideProperty()
    @IsOptional()
    create_user?: User;
    
    @ApiProperty({
        description: '유저 6문자 닉네임',
        default: '32jfza'
    })
    @IsString()
    @IsOptional()
    nickname: string;

    @ApiHideProperty()
    @IsString()
    @IsOptional()
    is_online?: boolean;

    @ApiHideProperty()
    @IsString()
    @IsOptional()
    roomname: string;
    
    @ApiProperty({
        description: '커스텀 태그 배열. 커스텀 태그는 최대 길이 5의 문자열을 배열로 가진다. 없을 시 빈 배열: [] 을 보낸다.',
        default: ['가정', '기타']
    })
    @MaxLength(5, {each: true})
    @IsString({each: true})
    @IsArray()
    @IsOptional()
    custom_tags: string[];

    @ApiProperty({
        description: '일반 태그 배열. 해당 태그에 대응하는 숫자 id들이 담긴 배열을 보낸다.(room/tag 에서 받을때 id 같이 제공) 없을 시 빈 배열: [] 을 보낸다.',
        default: [1, 3]
    })
    @IsInt({each: true})
    @IsArray()
    @IsOptional()
    tags: number[];

}
