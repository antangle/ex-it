import { User } from './../../../entities/user.entity';
import { IsArray, isBoolean, IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, isString, IsString, ValidateNested } from "class-validator";
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from 'src/consts/enum';

export class UserInfoDto {

    @ApiProperty({
        default: 1,
        description: '접속한 방의 id'
    })
    @Transform(({value}) => {
        return isNaN(value) ? value : parseInt(value);
    })
    @IsNumber()
    room_id?: number;

    @ApiProperty({
        default: 'host',
        description: 'host | speaker'
    })
    @IsEnum(Status)
    @IsOptional()
    status?: string = 'host';
}
