import { ApiHideProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUserDto {

    @IsEmail()
    @IsString()
    email?: string;

    @IsString()
    @IsOptional()
    password?: string;
    
    @IsString()
    phone?: string;

    @ApiHideProperty()
    @IsString()
    @IsOptional()
    nickname?: string;

    @IsBoolean()
    terms?: boolean;

    @IsBoolean()
    personal_info_terms?: boolean;

    @IsString()
    @IsOptional()
    refresh_token?: string;

    @IsBoolean()
    @IsOptional()
    is_authenticated?: boolean = true;

}
