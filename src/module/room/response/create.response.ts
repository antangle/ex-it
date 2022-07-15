import { BaseOKResponseWithTokens } from 'src/response/response.dto';
import { ApiProperty } from "@nestjs/swagger";

abstract class CreateResponseData {
    @ApiProperty()
    roomname: string;

    @ApiProperty()
    nickname: string;
}

export abstract class CreateRoomResponse extends BaseOKResponseWithTokens{
    constructor(){
        super();
    }

    @ApiProperty()
    data?: CreateResponseData
}