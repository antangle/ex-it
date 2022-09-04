import { BaseOKResponseWithTokens } from 'src/response/response.dto';
import { ApiProperty } from "@nestjs/swagger";

abstract class FindPeerResponseData {
    @ApiProperty({
        isArray: true,
        description: 'peerId의 배열을 준다. 없다면 빈 배열을 출력한다.'
    })
    peers: string;
}

export abstract class FindPeerResponse extends BaseOKResponseWithTokens{
    constructor(){
        super();
    }

    @ApiProperty()
    data?: FindPeerResponseData
}