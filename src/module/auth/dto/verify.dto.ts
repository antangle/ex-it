import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNumberString, Length } from "class-validator";

export class VerifyRequestDto {

    @ApiProperty({
        default: '01012345678'
    })
    @Length(11)
    @IsNumberString()
    phone: string;
}

export class VerifyDto {

    @ApiProperty({
        default: '01012345678'
    })
    @Length(11)
    @IsNumberString()
    phone: string;
    
    @ApiProperty()
    @IsNumber()
    verify_number: number;
}
