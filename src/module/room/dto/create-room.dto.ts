import { User } from './../../../entities/user.entity';
import { IsArray, IsBoolean, IsDate, IsInt, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiHideProperty } from '@nestjs/swagger';

export class CreateRoomDto {

    @MaxLength(20)
    @IsString()
    title: string;    
    
    @IsBoolean()
    hardcore: boolean;
    
    @IsBoolean()
    observer: boolean;
    
    @ApiHideProperty()
    @IsOptional()
    create_user?: User;
    
    @ApiHideProperty()
    @IsString()
    @IsOptional()
    nickname?: string;

    @ApiHideProperty()
    @IsString()
    @IsOptional()
    is_online?: boolean;

    @ApiHideProperty()
    @IsString()
    @IsOptional()
    roomname: string;
    
    @MaxLength(6, {each: true})
    @IsString({each: true})
    @IsArray()
    custom_tags: string[];

    @IsInt({each: true})
    @IsArray()
    tags: number[];

}
