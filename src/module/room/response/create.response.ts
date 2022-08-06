import { BaseOKResponseWithTokens } from 'src/response/response.dto';
import { ApiProperty } from "@nestjs/swagger";

abstract class CreateResponseData {
    @ApiProperty({
        description: '방제가 아닌, 접속한 해당 방의 socket-room id string',
        default: 'fjaweijfawef0ioja-409tajg09viz-fjaoiwejf890dzfv'
    })
    roomname: string;
}

export abstract class CreateRoomResponse extends BaseOKResponseWithTokens{
    constructor(){
        super();
    }

    @ApiProperty()
    data?: CreateResponseData
}