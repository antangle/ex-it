import { TokenData, BaseOKResponseWithTokens } from 'src/response/response.dto';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from "@nestjs/swagger";

abstract class MyAccountResponseData {
    @ApiProperty({
        default: '01012345678',
        description: '작대기(-) 없이 11문자의 numberstring'
    })
    phone: string;
    
    @ApiProperty({
        default: 'test@exit.com',
        description: '현재 user의 이메일. 소셜로그인은 소셜 로그인에 사용된 이메일을 제공한다.'
    })
    email: string;

    @ApiProperty({
        isArray: true,
        default: ['naver'],
        description: 'local | naver | kakao | facebook 가 조합된 array 형식이다.\n 다양한 소셜 로그인과 연동됬을시를 위해 array로 만들었다.'
    })
    type: string;
    
}

export abstract class MyAccountResponse extends BaseOKResponseWithTokens{
    constructor(){
        super();
    }

    @ApiProperty()
    data?: MyAccountResponseData
}