import { TokenData, BaseOKResponseWithTokens } from 'src/response/response.dto';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from "@nestjs/swagger";

abstract class SettingResponseData {
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

export abstract class SettingResponse extends BaseOKResponseWithTokens{
    constructor(){
        super();
    }

    @ApiProperty()
    data?: SettingResponseData
}