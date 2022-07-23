import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class ChangePwDto {

    @ApiProperty({
        default: 'oldpassword'
    })
    @IsString()
    old_pw?: string;
    
    @ApiProperty({
        default: 'oldpassword'
    })
    @IsString()
    old_pw_re?: string;
    
    @ApiProperty({
        default: 'newpassword'
    })
    @IsString()
    new_pw?: string;

}
