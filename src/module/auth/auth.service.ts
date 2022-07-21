import { NoNicknameAvailableException } from './../../exception/no-nickname.exception';
import { UnauthorizedUserException } from './../../exception/unauthorized.exception';
import { JwtAuthException } from 'src/exception/jwt.exception';
import { BadRequestCustomException } from './../../exception/bad-request.exception';
import { QueryRunner, Repository, QueryFailedError } from 'typeorm';
import { DatabaseException, UserExistsException } from './../../exception/database.exception';
import { OAuthLoginDto } from './dto/oauth-login.dto';
import { OauthHttpException } from '../../exception/axios.exception';
import { UtilService } from '../util/util.service';
import { UpdateResult, TypeORMError, Transaction, Connection } from 'typeorm';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Auth } from '../../entities/auth.entity';
import { AuthRepository } from './auth.repository';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { User } from 'src/entities/user.entity';
import { UserService } from '../user/user.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import consts from 'src/consts/consts';
import { UnhandledException } from 'src/exception/unhandled.exception';
import { CustomError } from 'src/exception/custom.exception';
import { UserRepository } from '../user/user.repository';
import { TokenData } from 'src/response/response.dto';
import { NotExistsException } from 'src/exception/not-exist.exception';

@Injectable()
export class AuthService {
    constructor(
        private authRepository: AuthRepository,
        private userRepository: UserRepository,
        private utilService: UtilService,
    ){}

    async signIn(user: User, type: string = consts.LOCAL, queryRunner?: QueryRunner):Promise<TokenData>{
        const userRepository = queryRunner ? queryRunner.manager.getCustomRepository(UserRepository) : this.userRepository;
        try{
            const tokens = this.utilService.signJwt(user, type);
            const updateDto: UpdateUserDto = {
                refresh_token: tokens.refresh_token
            }
            const updateResult = await userRepository.update(user.id, updateDto);
            if(!updateResult || updateResult.affected != 1) throw new NotExistsException(consts.UPDATE_FAILED, consts.SIGNIN_ERROR_CODE)
            return tokens;
        } catch(err){
            if(err instanceof NotExistsException) throw err;
            else if(err instanceof TypeORMError) throw new DatabaseException(consts.UPDATE_FAILED, consts.SIGNIN_ERROR_CODE, err);
            else throw new UnhandledException(this.signIn.name, consts.SIGNIN_ERROR_CODE, err);            
        }
    }

    async createAuth(auth: Auth, queryRunner?: QueryRunner){
        const repository = queryRunner ? queryRunner.manager.getCustomRepository(AuthRepository) : this.authRepository;
        try{
            return await repository.save(auth);
        }
        catch(err){
            if(err instanceof QueryFailedError) throw new UserExistsException(consts.EXISTS, consts.AUTH_CREATE_FAILED_ERROR_CODE, err)
            throw new DatabaseException(consts.DATABASE_CREATE_FAILED, consts.AUTH_CREATE_FAILED_ERROR_CODE, err)
        }
    }

    async getRandomNickname(){
        try{
            let nickname = this.utilService.makeRandomNickname();
            var count = 10;
            while(count > 0){
                if(!await this.userRepository.findOne({nickname: nickname})) break;
                nickname = this.utilService.makeRandomNickname();
                count--;
            }
            if(count == 0){
                throw new NoNicknameAvailableException(consts.TOO_MANY_TRIES, consts.GET_RANDOM_NICKNAME_ERROR_CODE);
            }
            return nickname;
        }
        catch(err){
            if(err instanceof NoNicknameAvailableException) throw err;
            else throw new UnhandledException(this.getRandomNickname.name, consts.GET_RANDOM_NICKNAME_ERROR_CODE, err);
        }
    }

    async findAuth(email: string, type: string): Promise<Auth>{
        return await this.authRepository.findOne({
            email: email,
            type: type
        })
    }

    //returns userId of Auth
    async updateOAuthRefreshToken(email: string, type: string, updateDto: UpdateAuthDto, queryRunner: QueryRunner): Promise<Auth[]>{
        const repository = queryRunner ? queryRunner.manager.getCustomRepository(AuthRepository) : this.authRepository;
        try{
            const auth = await repository.updateByEmailAndType(email, type, updateDto);
            if(!auth || auth.affected != 1) throw new NotExistsException(consts.TARGET_NOT_EXIST, consts.UPDATE_OAUTH_REFRESH_TOKEN_ERROR_CODE);
            return auth.raw;
        } catch(err){
            if(err instanceof NotExistsException) throw err;
            else if(err instanceof TypeORMError) throw new DatabaseException(consts.UPDATE_FAILED, consts.UPDATE_OAUTH_REFRESH_TOKEN_ERROR_CODE, err);
            else throw new UnhandledException(this.updateOAuthRefreshToken.name, consts.UPDATE_OAUTH_REFRESH_TOKEN_ERROR_CODE, err);            
        } 
    }

    //local validation
    async validateUser(email: string, oldPassword: string): Promise<any> {
        try{
            const user = await this.userRepository.findOne({email: email});
            //no user match exists
            if(!user || !user.password) throw new UnauthorizedUserException(consts.TARGET_NOT_EXIST, consts.VALIDATE_USER_ERROR_CODE);
            //oauth login user can't change pw
            let isPasswordMatch = await this.utilService.comparePassword(oldPassword, user.password);

            if(!isPasswordMatch) throw new UnauthorizedUserException(consts.PASSWORD_NOT_MATCH, consts.VALIDATE_USER_ERROR_CODE);
            const { password, ...result } = user;
            return result;
        } catch(err){
            if(err instanceof UnauthorizedUserException) throw err;
            else throw new UnhandledException(this.validateUser.name, consts.VALIDATE_USER_ERROR_CODE, err);
        }
    }


    async compareRefreshTokens(refreshToken: string, userId: number){
        //if refresh token is valid, compare with database
        //get user depending on type.
        try{
            const user = await this.userRepository.findOne(userId);
            if(!user) throw new UnauthorizedUserException(consts.TARGET_NOT_EXIST, consts.COMPARE_REFRESH_TOKENS_ERROR_CODE);
            
            if(refreshToken == user.refresh_token) return user;
            else throw new UnauthorizedUserException(consts.BAD_REFRESH_TOKEN, consts.COMPARE_REFRESH_TOKENS_ERROR_CODE);
        }
        catch(err){
            if(err instanceof DatabaseException || err instanceof UnauthorizedUserException) throw(err);
            else throw new UnhandledException(this.compareRefreshTokens.name, consts.COMPARE_REFRESH_TOKENS_ERROR_CODE, err);
        }
    }

    async signNewJwtTokens(decodedRefreshToken: any, user: User): Promise<TokenData>{
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
            if(!axiosResponse) throw new UnauthorizedUserException(consts.UNAUTHORIZED_USER, consts.OAUTH_VALIDATE_ERROR_CODE);
            return axiosResponse;
        } catch(err){
            if(err instanceof UnauthorizedUserException) throw err;
            else throw new OauthHttpException(consts.INVALID_OAUTH_TOKEN, consts.OAUTH_VALIDATE_ERROR_CODE, err.response.data);
        }
    }
}
