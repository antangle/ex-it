import { User } from './../../../entities/user.entity';
import { IsArray, isBoolean, IsBoolean, IsDate, IsNumber, IsOptional, isString, IsString, ValidateNested } from "class-validator";
import { Transform } from 'class-transformer';

export class SearchRoomDto {

    @Transform(({value}) => {
        return isNaN(value) ? value : parseInt(value);
    })
    @IsNumber()
    @IsOptional()
    tag_id?: number = 0;

    @IsString()
    @IsOptional()
    title?: string = '';

    @Transform(({value}) => {
        return isNaN(value) ? value : parseInt(value);
    })
    @IsNumber()
    @IsOptional()
    page?: number = 30;

    @Transform(({value}) => {
        return isNaN(value) ? value : parseInt(value);
    })
    @IsNumber()
    @IsOptional()
    take?: number = 0;
}
