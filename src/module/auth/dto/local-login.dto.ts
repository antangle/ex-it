import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class LocalLoginDto {

    @ApiProperty({
        default: 'testuser@naver.com',
        description: '이메일'
    })
    @IsEmail()
    email?: string;
    
    @ApiProperty({
        default: 'testpassword',
        description: '최소 8자, 숫자 알파벳 섞어서'
    })
    @IsString()
    password?: string;

}
