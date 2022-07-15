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
    @ApiProperty()
    title: string;

    @ApiProperty()
    review_mode: string;

    @ApiProperty()
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