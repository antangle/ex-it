import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUserDto {

    @ApiProperty({
        default: 'testuser@naver.com'
    })
    @IsEmail()
    @IsString()
    email?: string;

    @ApiProperty({
        default: 'male',
        description: 'male'
    })
    @IsString()
    @IsOptional()
    sex?: string;

    @ApiProperty({
        default: '19581211',
        description: '생년월일'
    })
    @IsString()
    @IsOptional()
    birth?: string

    @ApiProperty({
        default: 'testpassword',
    })
    @IsString()
    @IsOptional()
    password?: string;
    
    @ApiProperty({
        default: '01012345678',
        description: '작대기(-) 없이 11문자의 numberstring'
    })
    @IsString()
    phone?: string;

    @ApiHideProperty()
    @IsString()
    @IsOptional()
    nickname?: string;

    @ApiProperty({
        default: true,
        description: '이용약관'
    })
    @IsBoolean()
    terms?: boolean;

    @ApiProperty({
        default: true,
        description: '개인정보처리방침'
    })
    @IsBoolean()
    personal_info_terms?: boolean;

    @ApiHideProperty()
    @IsString()
    @IsOptional()
    refresh_token?: string;

    @ApiProperty({
        default: true,
        description: '휴대폰 본인인증 유무'
    })
    @IsBoolean()
    @IsOptional()
    is_authenticated?: boolean = true;

}
