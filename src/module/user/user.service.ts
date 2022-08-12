import { BadRequestCustomException } from './../../exception/bad-request.exception';
import { NotExistsException } from '../../exception/not-exist.exception';
import { UnauthorizedUserException } from './../../exception/unauthorized.exception';
import { QueryRunner } from 'typeorm';
import { UnhandledException } from './../../exception/unhandled.exception';
import { DatabaseException, UserExistsException } from './../../exception/database.exception';
import { AuthRepository } from '../auth/auth.repository';
import { consts } from 'src/consts/consts';
import { UserRepository } from './user.repository';
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { QueryFailedError, Repository, UpdateResult, TypeORMError } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'src/entities/auth.entity';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private authRepository: AuthRepository,
  ){}

  //insert user
  async createUser(createUserDto: CreateUserDto, queryRunner?: QueryRunner): Promise<User> {
    let repository = queryRunner ? queryRunner.manager.getCustomRepository(UserRepository) : this.userRepository;
    try{
      const saveResult = await repository.save(createUserDto);
      return saveResult;
    } catch(err){
      if(err instanceof TypeORMError) throw new UserExistsException(consts.DATABASE_CREATE_FAILED, consts.USER_CREATE_ERROR_CODE, err);
      else throw new UnhandledException(this.createUser.name, consts.USER_CREATE_ERROR_CODE, err);
    }
  }

  //find user by email
  async findOneByEmail(email: string, queryRunner ?: QueryRunner): Promise<User>{
    const userRepository = queryRunner ? queryRunner.manager.getRepository(User) : this.userRepository;
    try{
        const user = await userRepository.findOne({email: email});
        if(!user) throw new UnauthorizedUserException(consts.TARGET_NOT_EXIST, consts.FIND_BY_EMAIL_ERROR_CODE);
        return user
    } catch(err){
      if(err instanceof UnauthorizedUserException) throw err;
      else throw new UnhandledException(this.findOneByEmail.name, consts.FIND_BY_EMAIL_ERROR_CODE, err);
    }
  }

  async findOneByEmailReturnNull(email: string, queryRunner?: QueryRunner): Promise<User>{
    const repository = queryRunner ? queryRunner.manager.getCustomRepository(UserRepository) : this.userRepository;
    try {
      const user = await repository.findOne({
        email: email
      });
      return user;
    } catch(err){
      throw new UnhandledException(this.findOneByEmail.name, consts.FIND_BY_EMAIL_ERROR_CODE, err);
    }
  }

  async updateLocalRefreshToken(userId: number, updateDto, queryRunner: QueryRunner):Promise<any> {
    try {
      const user: UpdateResult = await queryRunner.manager.getCustomRepository(UserRepository).update(userId, updateDto);
      if(!user || user.affected != 1) throw new NotExistsException(consts.UPDATE_FAILED, consts.UPDATE_LOCAL_REFRESH_TOKEN_ERROR_CODE);
    } catch(err){
      if(err instanceof NotExistsException) throw err;
      else if(err instanceof TypeORMError) throw new DatabaseException(consts.UPDATE_FAILED, consts.UPDATE_LOCAL_REFRESH_TOKEN_ERROR_CODE, err);
      else throw new UnhandledException(this.updateLocalRefreshToken.name, consts.UPDATE_LOCAL_REFRESH_TOKEN_ERROR_CODE);
    }
  }

  async checkEmailExists(email: string): Promise<boolean>{
    try {
      const user = await this.userRepository.findOne({
        email: email
      });
      return user == null;
    } catch(err){
      throw new UnhandledException(this.checkEmailExists.name, consts.CHECK_EMAIL_ERROR_CODE, err);
    }

  }

  async checkNicknameExists(nickname: string): Promise<boolean>{
    const user = await this.userRepository.findOne({
      nickname: nickname
    });
    return user != null;
  }

  //used for finding whether oauth user or local user
  async findUser(email: string, type: string, queryRunner?: QueryRunner): Promise<User>{
    const userRepository = queryRunner ? queryRunner.manager.getCustomRepository(UserRepository) : this.userRepository;
    const authRepository = queryRunner ? queryRunner.manager.getCustomRepository(AuthRepository) : this.authRepository;
    try{
      if(type == consts.LOCAL){
        return userRepository.findOne({
          email: email
        });
      } else{
        const auth: Auth = await authRepository.findOne({
          where: [{email: email}, {type: type}],
          relations: ['user']
        })  
        return auth.user;
      }
    } catch(err){
      throw new DatabaseException(consts.TARGET_NOT_EXIST, consts.FIND_USER_ERROR, err);
    }
  }








  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUserById(userId: number, queryRunner?: QueryRunner):Promise<User> {
    let userRepository = queryRunner ? queryRunner.manager.getCustomRepository(UserRepository) : this.userRepository; 
    try{
      const user = await userRepository.findOne(userId);
      if(!user) throw new NotExistsException(consts.TARGET_NOT_EXIST, consts.FINDUSER_ERROR_CODE);
      return user
    } catch(err){
      if(err instanceof NotExistsException) throw err;
      else throw new UnhandledException(this.findUserById.name, consts.FINDUSER_ERROR_CODE);
    }
  }

  updateByEmail(email: string, updateUserDto: UpdateUserDto){
    try{
      return this.userRepository.update({
        email: email
      }, updateUserDto);
    } catch(err){
      throw new DatabaseException(consts.TARGET_NOT_EXIST, consts.UPDATE_BY_EMAIL_ERROR_CODE, err);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto):Promise<UpdateResult> {
    try{
      const user = await this.userRepository.update(id, updateUserDto);
      if(!user || user.affected != 1) throw new NotExistsException(consts.TARGET_NOT_EXIST, consts.UPDATE_ERROR_CODE);
      return user;
    } catch(err){
      if(err instanceof NotExistsException) throw err;
      else throw new UnhandledException(this.update.name, consts.UPDATE_ERROR_CODE, err);
    }
  }
  
  softDelete(userId: number):Promise<UpdateResult> {
    try{
      return this.userRepository.softDelete(userId);
    } catch(err){
      if(err instanceof TypeORMError) throw new DatabaseException(consts.TARGET_NOT_EXIST, consts.REMOVE_ERROR_CODE, err);
      else throw new UnhandledException(this.softDelete.name, consts.REMOVE_ERROR_CODE, err);
    }
  }


}

