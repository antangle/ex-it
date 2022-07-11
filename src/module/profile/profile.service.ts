import { UnhandledException } from './../../exception/unhandled.exception';
import consts from 'src/consts/consts';
import { DatabaseException } from './../../exception/database.exception';
import { User } from 'src/entities/user.entity';
import { UserRepository } from './../user/user.repository';
import { QueryRunner } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfileService {
    constructor(
        private userRepository: UserRepository,
    ){}

    async getProfileInfo(userId: number, queryRunner?: QueryRunner){
        const userRepository = queryRunner ? queryRunner.manager.getCustomRepository(UserRepository) : this.userRepository;
        try{
            const user = await userRepository.getProfileQuery(userId);
            if(!user) throw new DatabaseException(consts.TARGET_NOT_EXIST, consts.GET_SETTING_INFO_ERROR_CODE);
            return user;
        } catch(err){
            if(err instanceof DatabaseException) throw err;
            else throw new UnhandledException(this.getProfileInfo.name, consts.GET_SETTING_INFO_ERROR_CODE, err);
        }
    }

    async getMyInfo(userId: number, queryRunner?: QueryRunner){
        const userRepository = queryRunner ? queryRunner.manager.getCustomRepository(UserRepository) : this.userRepository;
        try{
            const user = await userRepository.getReviewCount(userId);
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
                for(let i=0; i<auths.length; ++i){
                    types.push(auths[i].type);
                }

                return {
                    phone: user.phone,
                    email: email,
                    type: types
                }
            }
        } catch(err){
            if(err instanceof DatabaseException) throw err;
            else throw new UnhandledException(this.getMyAccountInfo.name, consts.GET_MY_ACCOUNT_ERROR_CODE, err);
        }
    }
/*     async getAlarmInfo(email: string, queryRunner?: QueryRunner){
        const userRepository = queryRunner ? queryRunner.manager.getCustomRepository(UserRepository) : this.userRepository;
        try{
            const user = await userRepository.findOne({
                where: {
                    email: email
                }
            });

            if(!user) throw new DatabaseException(consts.TARGET_NOT_EXIST, consts.GET_ALARM_INFO_ERROR_CODE);            
            return user.alarm;
            
        } catch(err){
            if(err instanceof DatabaseException) throw err;
            else throw new UnhandledException(this.getAlarmInfo.name, consts.GET_ALARM_INFO_ERROR_CODE, err);
        }
    } */
    /* 
    async getChatTimeInfo(email: string, date: Date, queryRunner?: QueryRunner){
        const userRepository = queryRunner ? queryRunner.manager.getCustomRepository(UserRepository) : this.userRepository;
        try{
            const user = await userRepository.getRoomTalkTime(email, date);
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
    } */
}
