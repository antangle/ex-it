import { Observable, lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { User } from 'src/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Injectable, HttpStatus, UseFilters } from '@nestjs/common';
import consts from 'src/consts/consts';
import * as bcrypt from 'bcrypt';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class UtilService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private httpService: HttpService
    ){}
    
    async makeAccessTokenHttpRequest(accessToken: string, type: string = consts.LOCAL): Promise<AxiosResponse>{
        //type: kakao, facebook, naveer

        let url = consts[type.toUpperCase() + '_URL'];
        var options: AxiosRequestConfig;

        switch(type){
            case consts.KAKAO:
                options = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
                break;
            case consts.NAVER:
                options = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
                break;
            case consts.FACEBOOK:
                options = {
                    params: {
                        fields: "id",
                        access_token: accessToken
                    }
                }
                break;
        }
        
        return lastValueFrom(await this.httpService.axiosRef.get(url, options));
    }

    makeRandomNickname(){
        return Math.random().toString(36).slice(2,8);
    }
    makePayload(user: User, type: string = 'local'){
        return {
            email: user.email,
            nickname: user.nickname,
            type: type
        };
    }
    signJwt(user: User, type: string = consts.LOCAL){
        const payload = this.makePayload(user, type);
        const access_token = this.jwtService.sign(payload, {
            expiresIn: consts.JWT_ACCESS_TOKEN_EXP
        })
        const refresh_token = this.jwtService.sign({}, {
            expiresIn: consts.JWT_REFRESH_TOKEN_EXP
        });
        return {
            access_token,
            refresh_token
        };
    }

    async hashPassword(password: string): Promise<string>{
        const rounds: number = this.configService.get<number>('BCRYPT_SALT');
        const salt: string = await bcrypt.genSalt(+rounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    }

    async comparePassword(password: string, hashedPassword: string): Promise<boolean>{
        return bcrypt.compare(password, hashedPassword);
    }
}
