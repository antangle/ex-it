import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUserDto {

    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    password?: string;
    
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    nickname?: string;

    @IsBoolean()
    terms?: boolean;

    @IsBoolean()
    personal_info_terms?: boolean;

    @IsOptional()
    @IsString()
    refresh_token?: string;

    @IsOptional()
    @IsBoolean()
    is_authenticated?: boolean;

}
