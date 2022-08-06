import { BaseOKResponseWithTokens } from 'src/response/response.dto';
import { ApiProperty } from "@nestjs/swagger";

abstract class UserInfoData {
    @ApiProperty()
    nickname: string;
    
    @ApiProperty()
    alarm: boolean;
    
    @ApiProperty()
    total_time: number;

    @ApiProperty()
    total_call: number;

    @ApiProperty()
    connection: number;
}

export abstract class ReviewForm {
    @ApiProperty({
        description: '리뷰 제목'
    })
    title: string;

    @ApiProperty({
        description: '리뷰id. 서버에서 제목 대신 이 숫자로 리뷰 종류를 판별함.'
    })
    review_id: string;

    @ApiProperty({
        description: '해당 리뷰를 받는 총 count'
    })
    count: number;
}

abstract class UserInfoResponseData {
    @ApiProperty()
    userInfo: UserInfoData;

    @ApiProperty({
        isArray: true,
        default: ['가정', '개인']
    })
    usedTags: string;

    @ApiProperty({
        isArray: true,
        default: [{
            title: '시원하게 쏴대는',
            review_mode: 1,
            count: 2
        },{
            title: '재밌게 말하는',
            review_mode: 2,
            count: 0
        }]
    })
    reviews: ReviewForm;
}

export abstract class UserInfoResponse extends BaseOKResponseWithTokens{
    constructor(){
        super();
    }

    @ApiProperty()
    data?: UserInfoResponseData
}