import { ApiProperty } from "@nestjs/swagger";
import { BaseOKResponseWithTokens, BaseOKResponse } from "src/response/response.dto";

abstract class VerifyResponseData {
    @ApiProperty({
        default: true,
        description: '인증 성공시 true, 인증 실패시 false'
    })
    is_verified: boolean;
}

export abstract class VerifyResponse extends BaseOKResponse {
    constructor() {
        super();
    }

    @ApiProperty()
    data: VerifyResponseData;
}