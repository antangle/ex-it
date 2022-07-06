import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class ChangePwDto {

    @IsString()
    old_pw?: string;

    @IsString()
    new_pw?: string;

}
