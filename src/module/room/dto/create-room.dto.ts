import { User } from './../../../entities/user.entity';
import { IsArray, isBoolean, IsBoolean, IsDate, IsInt, IsNumber, IsOptional, isString, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";

export class CreateRoomDto {

    @IsString()
    title: string;    
    
    @IsBoolean()
    hardcore: boolean;
    
    @IsNumber()
    observer: number;
    
    @IsOptional()
    create_user?: User;

    @IsOptional()
    @IsNumber()
    max_occupancy?: number;
    
    @IsOptional()
    @IsString()
    nickname?: string;

    @IsOptional()
    @IsString()
    is_online?: boolean;

    @IsOptional()
    @IsString()
    roomname: string;
    
    @IsArray()
    @IsString({each: true})
    @MaxLength(6, {each: true})
    custom_tags: string[];

    @IsArray()
    @IsInt({each: true})
    tags: number[];

}
