import { ApiProperty } from "@nestjs/swagger";
import { BaseOKResponseWithTokens, BaseOKResponse } from "src/response/response.dto";

abstract class CheckEmailResponseData {
    @ApiProperty({
        default: true
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