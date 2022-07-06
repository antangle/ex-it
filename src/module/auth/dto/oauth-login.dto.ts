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

    @ApiProperty({name: consts.OAUTH_ACCESS_TOKEN})
    @IsString()
    oauth_access_token?: string;

    @ApiProperty({name: consts.OAUTH_REFRESH_TOKEN})
    @IsString()
    oauth_refresh_token?: string;

}
