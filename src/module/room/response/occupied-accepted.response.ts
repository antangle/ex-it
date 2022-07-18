import { BaseAcceptedResponseWithTokens, BaseOKResponseWithTokens } from 'src/response/response.dto';
import { ApiProperty } from "@nestjs/swagger";

abstract class OccupiedResponseData {
    @ApiProperty()
    isOccupied: boolean;
}

export abstract class OccupiedAcceptedResponse extends BaseAcceptedResponseWithTokens{
    constructor(){
        super();
    }

    @ApiProperty()
    data?: OccupiedResponseData
}