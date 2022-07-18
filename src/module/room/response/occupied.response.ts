import { BaseAcceptedResponseWithTokens, BaseOKResponseWithTokens } from 'src/response/response.dto';
import { ApiProperty } from "@nestjs/swagger";

abstract class OccupiedResponseData {
    @ApiProperty()
    isOccupied: boolean;
}

export abstract class OccupiedResponse extends BaseOKResponseWithTokens{
    constructor(){
        super();
    }

    @ApiProperty()
    data?: OccupiedResponseData
}