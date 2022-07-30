import { TokenData, BaseOKResponseWithTokens } from 'src/response/response.dto';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from "@nestjs/swagger";

abstract class SettingResponseData {
    @ApiProperty({
        default: '128fds',
        description: '숫자와 영문으로 조합된 길이 6의 문자'
    })
    nickname: string;
    
    @ApiProperty({
        default: true,
        description: '알림설정 on/off. true: on | false: off'
    })
    alarm: boolean;

    @ApiProperty({
        default: 150,
        description: '총 대화 시간(채팅 + 통화), 초 단위. observer을 제외한 host, guest일 때 합계'
    })
    total_time: number;

    @ApiProperty({
        default: 150,
        description: '총 통화 시간(이제 필요없는듯), 초 단위. observer을 제외한 host, guest일 때 합계'
    })
    total_call: number;

    @ApiProperty({
        default: 48,
        description: '대화 연결 횟수. observer을 제외한 host, guest일 때 합계'
    })
    connection: number;
    
}

export abstract class SettingResponse extends BaseOKResponseWithTokens{
    constructor(){
        super();
    }

    @ApiProperty()
    data?: SettingResponseData
}