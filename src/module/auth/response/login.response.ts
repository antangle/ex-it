import { ApiProperty } from "@nestjs/swagger";
import { BaseOKResponseWithTokens, BaseOKResponse } from "src/response/response.dto";

abstract class LoginResponseData {
    @ApiProperty({
        default: '128fds',
        description: '숫자와 영문으로 조합된 길이 6의 문자'
    })
    nickname: string;
}

export abstract class LoginResponse extends BaseOKResponseWithTokens {
    constructor() {
        super();
    }

    @ApiProperty()
    data: LoginResponseData;
}