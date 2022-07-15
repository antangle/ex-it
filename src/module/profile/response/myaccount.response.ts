import { TokenData, BaseOKResponseWithTokens } from 'src/response/response.dto';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from "@nestjs/swagger";

abstract class MyAccountResponseData {
    @ApiProperty()
    phone: string;
    
    @ApiProperty()
    email: string;

    @ApiProperty({
        isArray: true,
        default: ['kakao']
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