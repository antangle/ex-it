import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsNumber } from "class-validator";
import { StatusWithoutHost } from "src/consts/enum";

export class JoinRoomDto {
    @ApiProperty({
        description: 'speaker | guest'
    })
    @IsEnum(StatusWithoutHost)
    status: string;
    
    @ApiProperty({
        description: '해당 방의 id'
    })
    @Transform(({value}) => {
        return isNaN(value) ? value : parseInt(value);
    })
    @IsNumber()
    room_id: number;

    @ApiProperty({
        description: '해당 방의 version'
    })
    @Transform(({value}) => {
        return isNaN(value) ? value : parseInt(value);
    })
    @IsNumber()
    version: number;



    
}
