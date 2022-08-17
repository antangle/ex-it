import { ApiProperty } from "@nestjs/swagger";
import { BaseOKResponseWithTokens, BaseOKResponse } from "src/response/response.dto";

abstract class CheckEmailResponseData {
    @ApiProperty({
        default: true,
        description: '이메일이 사용 가능하면 true. 이메일이 이미 존재하면 false.'
    })
    available: boolean;
}

export abstract class CheckEmailResponse extends BaseOKResponse {
    constructor() {
        super();
    }

    @ApiProperty()
    data: CheckEmailResponseData;
}