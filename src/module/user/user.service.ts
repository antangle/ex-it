import { AuthRepository } from '../auth/auth.repository';
import consts from 'src/consts/consts';
import { UserRepository } from './user.repository';
import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { QueryFailedError, Repository, UpdateResult } from 'typeorm';
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
  create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.save(createUserDto);
  }
  
  //find user by email
  findOneByEmail(email: string):Promise<User>{
    return this.userRepository.findOne({
      email: email
    });
  }

  async removeLocalRefreshToken(email: string):Promise<any> {
    const updateDto: UpdateUserDto = {
      refresh_token: null
    }
    return this.userRepository.createQueryBuilder('user')
      .update<User>(User, updateDto)
      .where('email = :email', {email: email})
      .updateEntity(true)
      .execute();
    
  }
  
  async checkEmailExists(email: string): Promise<boolean>{
    const user = await this.userRepository.findOne({
      email: email
    });
    return user != null;
  }

  async checkNicknameExists(nickname: string): Promise<boolean>{
    const user = await this.userRepository.findOne({
      nickname: nickname
    });
    return user != null;
  }

  async findUser(email: string, type: string): Promise<User>{
    if(type == consts.LOCAL){
      return this.userRepository.findOne({
        email: email
      });
    } else{
      const auth: Auth = await this.authRepository.findOne({
        where: [{email: email}, {type: type}],
        relations: ['user']
      })

      return auth.user;
    }
  }








  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number):Promise<User> {
    return this.userRepository.findOne(id);
  }

  updateRefreshToken(){
    
  }

  updateByEmail(email: string, updateUserDto: UpdateUserDto){
    return this.userRepository.update({
      email: email
    }, updateUserDto);
  }

  update(id: number, updateUserDto: UpdateUserDto):Promise<UpdateResult> {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number):Promise<UpdateResult> {
    return this.userRepository.softDelete(id);
  }


}

