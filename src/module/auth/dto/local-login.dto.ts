import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class LocalLoginDto {

    @ApiProperty({
        default: 'testuser'
    })
    @IsEmail()
    email?: string;
    
    @ApiProperty({
        default: 'test'
    })
    @IsString()
    password?: string;

}
