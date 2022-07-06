import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";
import consts from "src/consts/consts";

export class OAuthSignInDto {

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

    @ApiProperty()
    @IsBoolean()
    terms?: boolean;

    @ApiProperty()
    @IsBoolean()
    personal_info_terms?: boolean;

    @ApiProperty()
    @IsBoolean()
    is_authenticated?: boolean;

}
