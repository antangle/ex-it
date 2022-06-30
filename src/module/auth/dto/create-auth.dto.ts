import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAuthDto {

    @IsString()
    email?: string;

    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    refresh_token?: string;

}
