import { BaseOKResponseWithTokens } from 'src/response/response.dto';
import { ApiProperty } from "@nestjs/swagger";

abstract class SearchResponseData {

    @ApiProperty()
    room_id: number;
    
    @ApiProperty()
    hardcore: boolean;
    
    @ApiProperty()
    created_at: Date;
    
    @ApiProperty({
        default: '오늘 날씨가 참 좋네요'
    })
    title: string;
    
    @ApiProperty({
        description: '게스트가 들어올 수 있는 방인지 아닌지의 유무. true = 가능 false = 불가능'
    })
    guest: boolean;
    
    @ApiProperty({
        default: '1f90zs'
    })
    nickname: string;
    
    @ApiProperty()
    is_occupied: boolean;
    
    @ApiProperty({
        isArray: true,
        default: ['가정', '개인']
    })
    tags: string;
    
    @ApiProperty({
        isArray: true,
        default: [2, 4]
    })
    tagids: number;
    
    @ApiProperty({
        default: 21,
        description: '게스트 카운트.'
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