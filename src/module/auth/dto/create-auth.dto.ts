import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAuthDto {

    @IsString()
    email?: string;

    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    oauth_refresh_token?: string;

}
