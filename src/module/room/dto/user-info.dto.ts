import { User } from './../../../entities/user.entity';
import { IsArray, isBoolean, IsBoolean, IsDate, IsNumber, IsOptional, isString, IsString, ValidateNested } from "class-validator";
import { Transform } from 'class-transformer';

export class UserInfoDto {

    @Transform(({value}) => {
        return isNaN(value) ? value : parseInt(value);
    })
    @IsNumber()
    room_id?: number;

    @IsString()
    @IsOptional()
    status?: string = 'host';
}
