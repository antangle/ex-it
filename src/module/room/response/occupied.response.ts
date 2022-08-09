import { BaseAcceptedResponseWithTokens, BaseOKResponseWithTokens } from 'src/response/response.dto';
import { ApiProperty } from "@nestjs/swagger";

abstract class OccupiedResponseData {
    @ApiProperty({
        description: '해당 방에 speaker가 있다면 true, else false'
    })
    isOccupied: boolean;
}

export abstract class OccupiedResponse extends BaseOKResponseWithTokens{
    constructor(){
        super();
    }

    @ApiProperty()
    data?: OccupiedResponseData
}