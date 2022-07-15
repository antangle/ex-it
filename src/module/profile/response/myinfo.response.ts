import { TokenData, BaseOKResponseWithTokens } from 'src/response/response.dto';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from "@nestjs/swagger";
import { ReviewForm } from 'src/module/room/response/user-info.response';

abstract class MyInfoResponseData {
    @ApiProperty()
    nickname: string;
    
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

export abstract class MyInfoResponse extends BaseOKResponseWithTokens{
    constructor(){
        super();
    }

    @ApiProperty()
    data?: MyInfoResponseData
}