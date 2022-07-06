import { Auth } from 'src/entities/auth.entity';
import { reviewMapperArray } from './dto/reviewArray';
import { UnhandledException } from './../../exception/unhandled.exception';
import consts from 'src/consts/consts';
import { DatabaseException } from './../../exception/database.exception';
import { UserService } from './../user/user.service';
import { User } from 'src/entities/user.entity';
import { Alarm } from './../../entities/alarm.entity';
import { AuthRepository } from './../auth/auth.repository';
import { UserRepository } from './../user/user.repository';
import { Repository, QueryRunner, QueryFailedError, TypeORMError, IsNull } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Review } from 'src/entities/review.entity';
import { RoomJoin } from 'src/entities/roomJoin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { number } from 'joi';

@Injectable()
export class ProfileService {
    constructor(
        private userRepository: UserRepository,
    ){}
    
    //used for finding whether oauth user or local user
    parseReview(reviews: any[]){
        try{
            let data = [];
            for(let i=1; i<reviewMapperArray.length; ++i){
                data.push({
                    title: reviewMapperArray[i],
                    count: 0
                })
            }
            if(reviews[0].mode != null){
                reviews.map(review => {
                    var idx: number = +review.mode - 1
                    data[idx].count = review.count;                    
                })
            }
            return data;
        } catch(err){
            throw err;
        }
    }

    async getProfileInfo(email: string, queryRunner?: QueryRunner){
        const userRepository = queryRunner ? queryRunner.manager.getCustomRepository(UserRepository) : this.userRepository;
        try{
            const user = await userRepository.getSettingInfo(email);
            if(!user) throw new DatabaseException(consts.TARGET_NOT_EXIST, consts.GET_SETTING_INFO_ERROR_CODE);
            return user;
        } catch(err){
            if(err instanceof DatabaseException) throw err;
            else throw new UnhandledException(this.getProfileInfo.name, consts.GET_SETTING_INFO_ERROR_CODE, err);
        }
    }

    async getMyInfo(email: string, queryRunner?: QueryRunner){
        const userRepository = queryRunner ? queryRunner.manager.getCustomRepository(UserRepository) : this.userRepository;
        try{
            const user = await userRepository.getReviewCount(email);
            if(!user) throw new DatabaseException(consts.TARGET_NOT_EXIST, consts.GET_MY_INFO_ERROR_CODE);
            return user;
        } catch(err){
            if(err instanceof DatabaseException) throw err;
            else throw new UnhandledException(this.getMyInfo.name, consts.GET_MY_INFO_ERROR_CODE, err);
        }
    }
    
    async getMyAccountInfo(email: string, type: string, queryRunner?: QueryRunner){
        const userRepository = queryRunner ? queryRunner.manager.getCustomRepository(UserRepository) : this.userRepository;
        try{
            if(type == consts.LOCAL){
                const user: User = await userRepository.findOne({email: email});
                if(!user) throw new DatabaseException(consts.TARGET_NOT_EXIST, consts.GET_MY_ACCOUNT_ERROR_CODE);
                return {
                    phone: user.phone,
                    email: email,
                    type: [type]
                }
            } else{
                const user = await userRepository.findOne({
                    where: {
                        email: email
                    },
                    relations: ['auth']
                });
                if(!user) throw new DatabaseException(consts.TARGET_NOT_EXIST, consts.GET_MY_ACCOUNT_ERROR_CODE);
                
                const auths = user.auth;
                const types = [];
                let authEmail = email;
                for(let i=0; i<auths.length; ++i){
                    if(auths[i].type == type) authEmail = auths[i].email;
                    types.push(auths[i].type);
                }

                return {
                    phone: user.phone,
                    email: authEmail,
                    type: types
                }
            }
        } catch(err){
            if(err instanceof DatabaseException) throw err;
            else throw new UnhandledException(this.getMyAccountInfo.name, consts.GET_MY_ACCOUNT_ERROR_CODE, err);
        }
    }
    async getAlarmInfo(email: string, queryRunner?: QueryRunner){
        const userRepository = queryRunner ? queryRunner.manager.getCustomRepository(UserRepository) : this.userRepository;
        try{
            const user = await userRepository.findOne({
                where: {
                    email: email
                },
                relations: ['alarm']
            });

            if(!user) throw new DatabaseException(consts.TARGET_NOT_EXIST, consts.GET_ALARM_INFO_ERROR_CODE);
            const { id, ...result } = user.alarm;
            return result;
            
        } catch(err){
            if(err instanceof DatabaseException) throw err;
            else throw new UnhandledException(this.getAlarmInfo.name, consts.GET_ALARM_INFO_ERROR_CODE, err);
        }
    }
    
    async getChatTimeInfo(email: string, date: Date, queryRunner?: QueryRunner){
        const userRepository = queryRunner ? queryRunner.manager.getCustomRepository(UserRepository) : this.userRepository;
        try{
            const user = await userRepository.getRoomTalkTime(email, date);
            console.log(user);
            if(!user){
                return {
                    'total_time': 0,
                    'total_call': 0
                }
            }
            return user;
        } catch(err){
            if(err instanceof DatabaseException) throw err;
            else throw new UnhandledException(this.getChatTimeInfo.name, consts.GET_CHATTIME_INFO_ERROR_CODE, err);
        }
    }
}
