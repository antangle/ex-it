import consts from 'src/consts/consts';
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class OnlyTokenDto {

    @ApiProperty({name: consts.REFRESH_TOKEN})
    @IsString()
    refreshToken?: string;

}
