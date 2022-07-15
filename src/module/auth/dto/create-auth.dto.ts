import { OauthType } from './../../../consts/enum';
import { IsBoolean, IsDate, IsEmail, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Status } from "src/consts/enum";

export class CreateAuthDto {

    @IsEmail()
    email?: string;

    @IsEnum(OauthType)
    type?: string;

    @IsOptional()
    @IsString()
    oauth_refresh_token?: string;

}
