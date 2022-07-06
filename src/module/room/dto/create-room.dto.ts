import { User } from './../../../entities/user.entity';
import { IsArray, isBoolean, IsBoolean, IsDate, IsNumber, IsOptional, isString, IsString, ValidateNested } from "class-validator";

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
    
}
