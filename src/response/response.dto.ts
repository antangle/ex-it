import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from "@nestjs/swagger";
import consts from 'src/consts/consts';

export abstract class TokenData {
    @ApiProperty({
        description: `jwt access_token. 30분 후 expire되며, api를 이용할 때마다 새로 갱신된다.`
    })
    access_token: string;

    @ApiProperty({
        description: `jwt refresh_token. 14일 후 expire되며, 로그인 시 새로 갱신된다. 
        또한 access_token이 만료되고, refresh_token의 기한이 하루 남았을 때 
        authentication이 필요한 api사용 시 갱신된다.`
    })
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

export abstract class TooManyRequestResponse {
    @ApiProperty({
        default: HttpStatus.TOO_MANY_REQUESTS
    })
    code: number;

    @ApiProperty({
        default: consts.TOO_MANY_REQUESTS
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
/* 
    @ApiProperty()
    msg?: string; */
}

export abstract class BaseOKResponseWithTokens {
    @ApiProperty({
        default: HttpStatus.OK,
    })
    code: number;
/* 
    @ApiProperty()
    msg?: string;
     */
    @ApiProperty({
        description: '인증이 필요한 api를 사용시 받는 access, refresh 토큰'
    })
    tokens?: TokenData;
}

export abstract class BaseAcceptedResponseWithTokens {
    @ApiProperty({
        default: HttpStatus.ACCEPTED
    })
    code: number;

    @ApiProperty()
    msg?: string;
    
    @ApiProperty({
        description: '인증이 필요한 api를 사용시 받는 access, refresh 토큰'
    })
    tokens?: TokenData;
}
