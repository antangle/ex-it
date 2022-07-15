import { Room } from 'src/entities/room.entity';
import { BaseOKResponseWithTokens } from 'src/response/response.dto';
import { ApiProperty } from "@nestjs/swagger";

abstract class GetEndResponseData {
    @ApiProperty()
    room: Room;

    @ApiProperty()
    observer_count: number;

    @ApiProperty({
        isArray: true,
        default: [
            "시원하게 쏴대는",
            "재밌게 말하는",
            "공감을 잘 하는",
            "인사이트가 넘치는",
            "잘 경청하는"
        ]
    })
    reviews: string;
}

export abstract class GetEndRoomResponse extends BaseOKResponseWithTokens{
    constructor(){
        super();
    }

    @ApiProperty()
    data?: GetEndResponseData
}