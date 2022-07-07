import { User } from './../../../entities/user.entity';
import { IsArray, isBoolean, IsBoolean, IsDate, IsDateString, IsNumber, IsOptional, isString, IsString, ValidateNested } from "class-validator";
import { Transform } from 'class-transformer';

export class DateDto {

    @IsOptional()
    @Transform(({value}) => {
        return new Date(value).toISOString();
    })
    date?: Date;
}
