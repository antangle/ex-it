import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from "@nestjs/swagger";
import consts from 'src/consts/consts';

export abstract class TokenData {
    @ApiProperty()
    access_token: string;

    @ApiProperty()
    refresh_token: string;
}

export abstract class UnauthorizedResponse {
    @ApiProperty({
        default: HttpStatus.UNAUTHORIZED
    })
    code: number;

    @ApiProperty({
        default: consts.UNAUTHORIZED_USER
    })
    msg?: string;
}

export abstract class BadRequestResponse {
    @ApiProperty({
        default: HttpStatus.BAD_REQUEST
    })
    code: number;

    @ApiProperty({
        default: consts.BAD_REQUEST
    })
    msg?: string;
}

export abstract class InternalServerErrorResponse {
    @ApiProperty({
        default: HttpStatus.INTERNAL_SERVER_ERROR
    })
    code: number;

    @ApiProperty({
        default: consts.SERVER_ERROR
    })
    msg?: string;
}

export abstract class BaseOKResponse {
    @ApiProperty({
        default: HttpStatus.OK
    })
    code: number;

    @ApiProperty()
    msg?: string;
}

export abstract class BaseOKResponseWithTokens {
    @ApiProperty({
        default: HttpStatus.OK
    })
    code: number;

    @ApiProperty()
    msg?: string;
    
    @ApiProperty()
    tokens?: TokenData;
}