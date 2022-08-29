import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class FcmMessageDto {
    @ApiProperty({
        description: 'fcm 메세지 제목'
    })
    @IsString()
    title?: string;

    @ApiProperty({
        description: 'fcm 메세지 내용'
    })
    @IsString()
    message?: string;

    @ApiProperty({
        description: 'fcm 토큰'
    })
    @IsString()
    fcm_token?: string;

}
