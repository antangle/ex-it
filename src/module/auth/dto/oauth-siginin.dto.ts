import { OauthType } from './../../../consts/enum';
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsEnum, IsString } from "class-validator";
import consts from "src/consts/consts";

export class OAuthSignInDto {

    @ApiProperty({
        default: 'test@naver.com',
        description: '이메일'
    })
    @IsEmail()
    email?: string;
    
    @ApiProperty({
        default: 'kakao',
        description: 'kakao | naver | facebook'
    })
    @IsEnum(OauthType)
    type?: string;

    @ApiProperty({
        description: '소셜로그인 access_token'
    })
    @IsString()
    oauth_access_token?: string;

    @ApiProperty({
        description: '소셜로그인 refresh_token'
    })
    @IsString()
    oauth_refresh_token?: string;

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

}
