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
    
    @ApiProperty()
    observer: boolean;
    
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