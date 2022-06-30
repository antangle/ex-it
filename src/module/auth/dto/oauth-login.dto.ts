import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import consts from "src/consts/consts";

export class OAuthLoginDto {

    @ApiProperty()
    @IsString()
    email?: string;
    
    @ApiProperty()
    @IsString()
    type?: string;

    @ApiProperty({name: consts.ACCESS_TOKEN})
    @IsString()
    accessToken?: string;

    @ApiProperty({name: consts.REFRESH_TOKEN})
    @IsString()
    refreshToken?: string;

}
