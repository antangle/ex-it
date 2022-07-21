import { ApiProperty } from "@nestjs/swagger";
import { BaseOKResponseWithTokens, BaseOKResponse } from "src/response/response.dto";

abstract class VerifyResponseData {
    @ApiProperty({
        default: true
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