import { Room } from 'src/entities/room.entity';
import { BaseOKResponseWithTokens } from 'src/response/response.dto';
import { ApiProperty } from "@nestjs/swagger";
import { ReviewMapper } from 'src/entities/reviewMapper.entity';

abstract class GetEndResponseData {

    @ApiProperty({
        default: 120,
        description: '대화한 총 시간. 초(s)단위. speaker가 host의 방에 접속한 그 순간부터 시간을 센다. 프론트에서 시간을 관리해야하나?'
    })
    talk_time: number;

    @ApiProperty({
        default: 23,
        description: '지금까지 이 방에 게스트로 들어온 사람들의 총 수'
    })
    guest_count: number;

    @ApiProperty({
        isArray: true,
        description: '등록할 리뷰들에 대한 정보'
    })
    reviews: ReviewMapper;
}

export abstract class GetEndRoomResponse extends BaseOKResponseWithTokens{
    constructor(){
        super();
    }

    @ApiProperty()
    data?: GetEndResponseData
}