import { TokenData, BaseOKResponseWithTokens } from 'src/response/response.dto';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from "@nestjs/swagger";
import { ReviewForm } from 'src/module/room/response/user-info.response';

abstract class MyInfoResponseData {
    @ApiProperty({
        default: '128fds',
        description: '숫자와 영문으로 조합된 길이 6의 문자'
    })
    nickname: string;
    
    @ApiProperty({
        isArray: true,
        default: [{
            title: '시원하게 쏴대는',
            review_id: 1,
            count: 2
        },{
            title: '재밌게 말하는',
            review_id: 2,
            count: 0
        }]
    })
    reviews: ReviewForm;
    
}

export abstract class MyInfoResponse extends BaseOKResponseWithTokens{
    constructor(){
        super();
    }

    @ApiProperty()
    data?: MyInfoResponseData
}