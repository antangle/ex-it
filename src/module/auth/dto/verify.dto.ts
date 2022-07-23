import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNumberString, Length } from "class-validator";

export class VerifyRequestDto {

    @ApiProperty({
        default: '01012345678',
        description: '작대기(-) 없이 11문자의 numberstring'
    })
    @Length(11)
    @IsNumberString()
    phone: string;
}

export class VerifyDto extends VerifyRequestDto{

    @ApiProperty({
        default: '1234',
        description: '1000~9999 사이의 길이 4의 무작위 숫자.'
    })
    @IsNumber()
    verify_number: number;
}
