import { UtilService } from '../module/util/util.service';
import consts from 'src/consts/consts';
import { ITokens } from '../types/express';
import { AuthService } from '../module/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtException } from 'src/exception/jwt.exception';

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
        if(authorization === undefined){
            throw new JwtException('no tokens');
        }

        const accessToken: string = authorization.replace('Bearer ', '').trim();
        const refreshToken: string = request.body.refresh_token;
        const type: string = request.body.type;

        let decoded = this.validateToken(accessToken);
        
        if(decoded){
            request.user = {
                email: decoded.email,
                type: type
            }
            const payload = this.utilService.makePayload({
                email: decoded.email,
                nickname: decoded.nickname
            }, type);

            const newAccessToken: string = this.utilService.signJwt(payload, type).access_token;
            request.tokens = {
                access_token: newAccessToken,
                refresh_token: refreshToken
            };
            return true;
        }
                
        //verify refresh token, if invalid, throw? - later 작업
        let decodedRefreshToken;
        try{
            decodedRefreshToken = this.jwtService.verify(refreshToken);
        }
        catch(err){
            throw new JwtException(err.message);
        }

        //compare refresh tokens
        decoded = this.jwtService.decode(accessToken) as {[key: string]: any};
        const user = await this.authService.compareRefreshTokens(refreshToken, decoded.email, type);        
        if(!user){
            throw new JwtException('refresh token not match');
        }

        let tokens: ITokens;
        //sign new jwt tokens
        if(decodedRefreshToken.exp <= Date.now()/1000 + consts.ONE_DAY_IN_SECONDS && decodedRefreshToken.exp > Date.now()/1000){
            //update refresh token
            tokens = await this.authService.signIn(user, type);
        }
        else{
            tokens = this.utilService.signJwt(user, type);
            tokens.refresh_token = null;
        }

        request.tokens = tokens;
        request.user = {
            email: user.email,
            type: type
        }
        return true;
    }

    validateToken(token: string){
        try{
            const verify = this.jwtService.verify(token);
            //if valid access_token
            return verify;
        }
        catch(err){
            //if expired access_token, ask for refresh token
            if(err.message == 'jwt expired'){
                return null;
            }
            //else throw
            else{
                throw new JwtException(err.message);
            }
        }
    }
}
