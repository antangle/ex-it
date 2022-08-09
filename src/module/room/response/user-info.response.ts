import { BaseOKResponseWithTokens } from 'src/response/response.dto';
import { ApiProperty } from "@nestjs/swagger";
import { SettingResponseData } from 'src/module/profile/response/profile.response';

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

    @ApiProperty({
        description: '호스트 닉네임'
    })
    hostNickname: string;

    @ApiProperty({
        description: '스피커 닉네임'
    })
    speakerNickname: string;

    @ApiProperty()
    userInfo: SettingResponseData;

    @ApiProperty({
        isArray: true,
        default: ['가정', '개인'],
        description: '사용자가 가장 많이 사용한 태그들. 최대 3개'
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