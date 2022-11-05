import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UtilService } from '../module/util/util.service';
import { consts } from 'src/consts/consts';
import { AuthService } from '../module/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, Inject, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UnauthorizedUserException } from 'src/exception/unauthorized.exception';
import { TokenData } from 'src/response/response.dto';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private jwtService: JwtService,
        private authService: AuthService,
        private utilService: UtilService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger
    ) {
        super();
    }
    async canActivate(context: ExecutionContext){
        const request: Request = context.switchToHttp().getRequest();
        const authorization: string = request.headers.authorization;
        if(!authorization) throw new UnauthorizedUserException(consts.JWT_NOT_EXIST, consts.JWT_STRATEGY_ERROR_CODE);
        
        //at from Authorization, rt from custom header Refresh-Token
        const accessToken: string = authorization.replace('Bearer ', '').trim();
        
        let decoded = this.validateAccessToken(accessToken);
        let tokens: TokenData;
        //if valid access token, then sign and return
        if(decoded) {
            tokens = this.utilService.signJwt(decoded);
            tokens.refresh_token = null;
        }
        else {
            const refreshToken: string = request.get(consts.REFRESH_TOKEN_HEADER);
            if(!refreshToken) throw new UnauthorizedUserException(consts.JWT_NOT_EXIST, consts.JWT_STRATEGY_ERROR_CODE);
            let decodedRefreshToken: any;
            //verify refresh token, if invalid, throw
            try{
                decodedRefreshToken = this.jwtService.verify(refreshToken);
            }
            catch(err){
                throw new UnauthorizedUserException(consts.INVALID_JWT, consts.JWT_STRATEGY_ERROR_CODE, err);
            }
    
            //compare refresh tokens
            decoded = this.jwtService.decode(accessToken) as {[key: string]: any};
            const user = await this.authService.compareRefreshTokens(refreshToken, decoded.id);
    
            //sign new jwt tokens
            if(decodedRefreshToken.exp <= Date.now()/1000 + consts.ONE_DAY_IN_SECONDS && decodedRefreshToken.exp > Date.now()/1000){
                //update refresh token
                tokens = await this.authService.signIn(user, decoded.type);
            }
            else{
                tokens = this.utilService.signJwt(user, decoded.type);
                tokens.refresh_token = null;
            }
        }
        //set user, tokens
        request.user = this.utilService.makePayload(decoded, decoded.type);
        request.tokens = tokens;
        this.logger.log(`current user: ${JSON.stringify(request.user)}`);
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
                throw new UnauthorizedUserException(consts.INVALID_JWT, consts.JWT_STRATEGY_ERROR_CODE, err);
            }
        }
    }
}
