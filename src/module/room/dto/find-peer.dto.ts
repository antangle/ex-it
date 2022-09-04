import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { isNumber, IsNumber, IsNumberString, IsOptional, isString, IsString } from 'class-validator';

export class FindPeerDto {

    @ApiProperty({
        description: 'peer들을 알고 싶은 roomname. 자기 자신의 peerId도 포함될 수 있다.',
        default: 'aowiefjoaiwejfoiazswjefo-faiweuhfjoiawsefioaz'
    })
    @IsString()
    roomname: string;
    
}
