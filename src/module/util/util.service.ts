import { ReviewMapper } from './../../entities/reviewMapper.entity';
import { SensHttpException } from './../../exception/axios.exception';
import { AuthorizedUser } from './../../types/user.d';
import { TokenData } from 'src/response/response.dto';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { User } from 'src/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';
import { consts } from 'src/consts/consts';

@Injectable()
export class UtilService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private httpService: HttpService,
        @InjectRepository(ReviewMapper) private reviewMapperRepository: Repository<ReviewMapper>
    ){}
    
    makeSignature(url: string, date: number, method: string = 'POST') {
        
        var space = " ";				// one space
        var newLine = "\n";				// new line
        var timestamp = date.toString();			// current timestamp (epoch)
        var accessKey = this.configService.get('NCLOUD_API_KEY')			// access key id (from portal or Sub Account)
        var secretKey = this.configService.get('NCOULD_API_SECRET')			// secret key (from portal or Sub Account)
        var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
        hmac.update(method);
        hmac.update(space);
        hmac.update(url);
        hmac.update(newLine);
        hmac.update(timestamp);
        hmac.update(newLine);
        hmac.update(accessKey);
        
        var hash = hmac.finalize();
    
        return hash.toString(CryptoJS.enc.Base64);
    }

    make4RandomDigit(): number{
        return Math.floor(1000 + Math.random() * 9000);
    }

    makeSensBody(guestNumber: string, randomNumber: number){
        const content = `[ex-it!] 인증번호[${randomNumber}]를 입력해주세요.`

        const messages = [{
            to: guestNumber,
            content: content
        }]

        const data = {
            type: consts.SMS,
            from: consts.FROM_PHONE_NUMBER,
            to: guestNumber,
            content: consts.SENS_DEFAULT,
            messages: messages
        }

        return data;
    }

    makeSensHttpOptions(date: number, url: string): AxiosRequestConfig{
        const options: AxiosRequestConfig = {
            headers : {
                'Content-type': 'application/json; charset=utf-8',
                'x-ncp-iam-access-key': this.configService.get('NCLOUD_API_KEY'),
                'x-ncp-apigw-timestamp': date,
                'x-ncp-apigw-signature-v2': this.makeSignature(url, date, 'POST'),
            },
        }
        return options;
    }

    async sendSmsMessage(guestNumber: string, randomNumber: number){
        const host = `https://sens.apigw.ntruss.com`
        const serviceId = this.configService.get('SENS_ID');
        const url = `/sms/v2/services/${serviceId}/messages`;
        const date = Date.now();

        const data = this.makeSensBody(guestNumber, randomNumber)
        const options = this.makeSensHttpOptions(date, url);

        return this.httpService.axiosRef.post(host+url, data, options)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                throw new SensHttpException(consts.SENS_RESPONSE_ERROR, consts.SEND_MESSAGE_ERROR_CODE, err);
            })
    }

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

    makePayload(user: User | any, type: string = 'local'): AuthorizedUser{
        let payload: AuthorizedUser = {
            id: user.id,
            email: user.email,
            type: type
        };
        if(user.auth) payload.authId = user.auth[0].id;
        else if(user.authId) payload.authId = user.authId;
        return payload;
    }

    signJwt(user: User | any, type: string = consts.LOCAL): TokenData{
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

    async findReviews(){
        return await this.reviewMapperRepository.find();
    }

    async parseReview(reviews: any[]){
        if(reviews.length == 0) return null;
        const reviewMapper = await this.findReviews();
        try{
            let data = {};
            for(let i=0; i<reviewMapper.length; ++i){
                data[reviewMapper[i].id] = {
                    title: reviewMapper[i].title,
                    review_id: reviewMapper[i].id,
                    count: '0'
                }
            }
            if(reviews[0].reviewMapperId != null){
                reviews.map(review => {
                    data[review.reviewMapperId].count = review.count;
                })
            }
            return Object.values(data);
        } catch(err){
            throw err;
        }
    }
}
