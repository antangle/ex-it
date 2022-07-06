import { UnauthorizedTokenException, BadRequestException } from './../exception/bad-request.exception';
import { UtilService } from '../module/util/util.service';
import consts from 'src/consts/consts';
import { ITokens } from '../types/express';
import { AuthService } from '../module/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtAuthException } from 'src/exception/jwt.exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private jwtService: JwtService,
        private authService: AuthService,
        private utilService: UtilService
    ) {
        super();
    }
    async canActivate(context: ExecutionContext){
        const request: Request = context.switchToHttp().getRequest();
        const authorization: string = request.headers.authorization;
        if(!authorization) throw new JwtAuthException(consts.JWT_NOT_EXIST, consts.JWT_STRATEGY_ERROR_CODE);


        //at from Authorization, rt from custom header Refresh-Token
        const accessToken: string = authorization.replace('Bearer ', '').trim();
        const refreshToken: string = request.get(consts.REFRESH_TOKEN_HEADER);
        
        let decoded = this.validateAccessToken(accessToken);
        //if valid access token, then sign and return
        if(decoded) return this.signJwtToken(request, decoded, refreshToken);

        //verify refresh token, if invalid, throw
        let decodedRefreshToken: any;
        try{
            decodedRefreshToken = this.jwtService.verify(refreshToken);
        }
        catch(err){
            throw new JwtAuthException(consts.INVALID_JWT, consts.JWT_STRATEGY_ERROR_CODE, err);
        }

        //compare refresh tokens
        decoded = this.jwtService.decode(accessToken) as {[key: string]: any};
        const user = await this.authService.compareRefreshTokens(refreshToken, decoded.email, decoded.type);

        let tokens: ITokens;
        //sign new jwt tokens
        if(decodedRefreshToken.exp <= Date.now()/1000 + consts.ONE_DAY_IN_SECONDS && decodedRefreshToken.exp > Date.now()/1000){
            //update refresh token
            tokens = await this.authService.signIn(user, decoded.type);
        }
        else{
            tokens = this.utilService.signJwt(user, decoded.type);
            tokens.refresh_token = refreshToken;
        }

        request.tokens = tokens;
        request.user = {
            email: user.email,
            type: decoded.type
        }
        return true;
    }

    private signJwtToken(request, decoded: any, refreshToken: string) {
        request.user = {
            email: decoded.email,
            type: decoded.type
        };
        const payload = this.utilService.makePayload({
            email: decoded.email,
            nickname: decoded.nickname
        }, decoded.type);

        const newAccessToken: string = this.utilService.signJwt(payload, decoded.type).access_token;
        request.tokens = {
            access_token: newAccessToken,
            refresh_token: refreshToken
        };
        return true;
    }

    //if jwt expired, then return null.
    validateAccessToken(token: string){
        try{
            const verify = this.jwtService.verify(token);
            //if valid access_token
            return verify;
        }
        catch(err){
            if(err.message == consts.JWT_EXPIRED){
                return null;
            }
            //else throw
            else{
                throw new JwtAuthException(consts.INVALID_JWT, consts.JWT_STRATEGY_ERROR_CODE, err);
            }
        }
    }
}
