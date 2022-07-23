import { OauthType } from './../../../consts/enum';
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsString } from "class-validator";

export class OAuthLoginDto {

    @ApiProperty({
        default: 'test@naver.com',
        description: '이메일'
    })
    @IsEmail()
    email?: string;
    
    @ApiProperty({
        default: 'naver',
        description: 'naver | kakao | facebook'
    })
    @IsEnum(OauthType)
    type?: string;

    @ApiProperty({
        default: 'aoiwejfoaiwejfopiawjeofiajweiofj',
        description: '소셜로그인 인증으로 받은 access_token'
    })
    @IsString()
    oauth_access_token?: string;
    
    @ApiProperty({
        default: 'faweijnfoiawjefioajweiofjaoiwejf',
        description: '소셜로그인 인증으로 받은 refresh_token'
    })
    @IsString()
    oauth_refresh_token?: string;

}
