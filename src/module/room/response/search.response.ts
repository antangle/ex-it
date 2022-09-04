import { BaseOKResponseWithTokens } from 'src/response/response.dto';
import { ApiProperty } from "@nestjs/swagger";

abstract class SearchResponseData {

    @ApiProperty({
        description: '방 고유번호(roomname과 다름)'
    })
    room_id: number;
    
    @ApiProperty({
        description: '하드코어 유무'
    })
    hardcore: boolean;
    
    @ApiProperty({
        description: '방 생성 시간'
    })
    room_created_at: Date;
    
    @ApiProperty({
        description: '방 제목',
        default: '오늘 날씨가 참 좋네요'
    })
    title: string;
    
    @ApiProperty({
        description: '게스트가 들어올 수 있는 방인지 아닌지의 유무. true = 가능 false = 불가능'
    })
    guest: boolean;
    
    @ApiProperty({
        description: '방장의 닉네임',
        default: '1f90zs'
    })
    nickname: string;
    
    @ApiProperty({
        description: '현제 방에 speaker가 들어가 있는지의 유무. true: speaker가 이미 있음 false: speaker가 방에 없음'
    })
    is_occupied: boolean;
    
    @ApiProperty({
        isArray: true,
        default: ['가정', '개인'],
        description: '방장이 선택한 이 방의 태그들.'
    })
    tags: string;
    
    @ApiProperty({
        isArray: true,
        default: [2, 4],
        description: '태그들의 id. tags의 array index에 맞춰 id가 제공된다'
    })
    tagids: number;
    
    @ApiProperty({
        default: 21,
        description: '현재 이 방에 들어왔던 모든 게스트 카운트.'
    })
    guest_count: number;
}

export abstract class SearchRoomResponse extends BaseOKResponseWithTokens{
    constructor(){
        super();
    }

    @ApiProperty({
        isArray: true
    })
    data?: SearchResponseData
}