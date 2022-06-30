import { OAuthLoginDto } from './dto/oauth-login.dto';
import { OauthError } from '../../exception/axios.exception';
import { UtilService } from '../util/util.service';
import { UpdateResult } from 'typeorm';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Auth } from '../../entities/auth.entity';
import { AuthRepository } from './auth.repository';
import { ITokens } from '../../types/express';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { User } from 'src/entities/user.entity';
import { UserService } from '../user/user.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import consts from 'src/consts/consts';
import { response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private authRepository: AuthRepository,
        private userService: UserService,
        private utilService: UtilService
    ){}

    async create(auth: Auth){
        return this.authRepository.save(auth);
    }

    async findOne(email: string, type: string){
        return await this.authRepository.findOne({
            where: {
                email: email,
                type: type
            }
        })
    }
    async getRandomNickname(){
        let nickname = this.utilService.makeRandomNickname();
        while(true){
            if(!await this.userService.checkNicknameExists(nickname)) break;
            nickname = this.utilService.makeRandomNickname();
        }
        return nickname;
    }

    async findAuth(email: string, type: string): Promise<Auth>{
        return this.authRepository.findOne({
            email: email,
            type: type
        })
    }

    async removeOAuthRefreshToken(email: string, type: string): Promise<UpdateResult>{
        const updateDto: UpdateAuthDto = {
            refresh_token: null
        }
        return this.authRepository.createQueryBuilder('auth')
            .update<Auth>(Auth, updateDto)
            .where('email = :email', {
                email: email
            })
            .andWhere('type = :type', {
                type: type
            })
            .returning('*')
            .updateEntity(true)
            .execute();
    }

    async saveOAuthRefreshToken(oauthLoginDto: OAuthLoginDto): Promise<UpdateResult>{
        const updateDto: UpdateAuthDto = {
            refresh_token: oauthLoginDto.refreshToken
        }
        return await this.authRepository.createQueryBuilder('auth')
            .update<Auth>(Auth, updateDto)
            .where('email = :email', {
                email: oauthLoginDto.email
            })
            .andWhere('type = :type', {
                type: oauthLoginDto.type
            })
            .returning('*')
            .updateEntity(true)
            .execute();
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findOneByEmail(email);
        //no user match exists
        if(!user) return null;
        //you have to go to oauth login!!
        if(!user.password) return null;
        let isPasswordMatch = await this.utilService.comparePassword(password, user.password);
        
        if(isPasswordMatch){
            const { password, ...result } = user;
            return result
        }
        return null;
    }

    async signIn(user: User, type: string = consts.LOCAL):Promise<ITokens>{
        
        const tokens = this.utilService.signJwt(user, type);

        const updateDto: UpdateUserDto = {
            refresh_token: tokens.refresh_token
        }

        await this.userService.update(user.id, updateDto);
        return tokens;
    }


    async compareRefreshTokens(refreshToken: string, email: string, type: string = consts.LOCAL){
        //if refresh token is valid, compare with database
        //get user depending on type.
        const user = await this.userService.findUser(email, type);

        if(!user){
            throw new HttpException('invalid refresh token', HttpStatus.UNAUTHORIZED);
        }
        if(refreshToken == user.refresh_token){
            return user;
        }
        return null;
    }

    async signNewJwtTokens(decodedRefreshToken: any, user: User): Promise<ITokens>{
        //if refresh token is not expired and near expire date(1d)
        if(decodedRefreshToken.exp <= Date.now()/1000 + consts.ONE_DAY_IN_SECONDS && decodedRefreshToken.exp > Date.now()/1000){
            //update refresh token
            return await this.signIn(user);
        }
        else{
            return this.utilService.signJwt(user);
        }
    }
    
    async validateOAuthAccessToken(accessToken: string, type: string){
        try{
            const axiosResponse = await this.utilService.makeAccessTokenHttpRequest(accessToken, type);
            return axiosResponse;
        } catch(err){
            console.log(err.response);
            throw new OauthError(err.response.statusText, 3, err.response.data);
        }
    }
}
