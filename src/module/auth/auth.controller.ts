import { OAuthSignInDto } from './dto/oauth-siginin.dto';
import { ChangePwDto } from './dto/change-pw.dto';
import { DatabaseException } from './../../exception/database.exception';
import { LocalLoginDto } from './dto/local-login.dto';
import { CustomError } from '../../exception/custom.exception';
import { UtilService } from '../util/util.service';
import { Connection, UpdateResult } from 'typeorm';
import { Auth } from '../../entities/auth.entity';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { UserService } from 'src/module/user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../../guard/localAuth.guard';
import { Body, Controller, Get, Post, Request, UseFilters, UseGuards, HttpException, HttpStatus, Req, Param } from '@nestjs/common';
import { CreateUserDto } from 'src/module/user/dto/create-user.dto';
import consts from 'src/consts/consts';
import { makeApiResponse, SetCode, SetJwtAuth } from 'src/functions/util.functions';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { OAuthLoginDto } from './dto/oauth-login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { OauthException } from 'src/exception/axios.exception';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private utilService: UtilService,
        private connection: Connection
    ){}

    @ApiBody({type: LocalLoginDto})
    @UseGuards(LocalAuthGuard)
    @SetCode(101)
    @Post('login')
    async login(@Request() req){
        const tokens = await this.authService.signIn(req.user);
        return makeApiResponse(HttpStatus.OK, tokens);
    }

    @SetJwtAuth()
    @SetCode(102)
    @Post('logout')
    async logout(@Request() req){
        //if user did oauth login
        const queryRunner = this.connection.createQueryRunner();
        try{
            await queryRunner.connect();
            await queryRunner.startTransaction();
    
            let userId = null;
            if(req.user.type != consts.LOCAL){
                const updateAuthDto: UpdateAuthDto = {
                    oauth_refresh_token: null
                }
                //returns userId
                userId = await this.authService.updateOAuthRefreshToken(req.user.email, req.user.type, updateAuthDto, queryRunner);
            }
            else{
                const user = await this.userService.findOneByEmail(req.user.email);
                userId = user.id;
            }
            const updateUserDto: UpdateUserDto = {
                refresh_token: null
            }

            await this.userService.updateLocalRefreshToken(userId, updateUserDto, queryRunner);
            await queryRunner.commitTransaction();        
            return makeApiResponse(HttpStatus.OK);
        } catch(err){
            await queryRunner.rollbackTransaction();
            throw(err);
        }
        finally{
            await queryRunner.release();
        }
    }

    @ApiBody({type: OAuthLoginDto})
    @SetCode(103)
    @Post('oauth_login')
    async oauthLogin(@Body() oauthLoginDto: OAuthLoginDto){
        //authentication with access_token
        //await this.authService.validateOAuthAccessToken(oauthLoginDto.oauth_access_token, oauthLoginDto.type);
        //if authenticated, login
        const queryRunner = this.connection.createQueryRunner();
        try{
            await queryRunner.connect();
            await queryRunner.startTransaction();

            const updateAuthDto: UpdateAuthDto = {
                oauth_refresh_token: oauthLoginDto.oauth_refresh_token
            };
            const userId = await this.authService.updateOAuthRefreshToken(oauthLoginDto.email, oauthLoginDto.type, updateAuthDto, queryRunner);
            const user = await this.userService.findUserById(userId, queryRunner);

            const tokens = await this.authService.signIn(user, oauthLoginDto.type);

            await queryRunner.commitTransaction();
            return makeApiResponse(HttpStatus.OK, tokens);
        } catch(err){
            await queryRunner.rollbackTransaction();
            throw err;
        } finally{
            await queryRunner.release();
        }
    }

    //you can only change passwords in local.
    @ApiBody({type: ChangePwDto})
    @SetJwtAuth()
    @SetCode(105)
    @Post('change_pw')
    async changePassword(
        @Request() req,
        @Body() changePwDto: ChangePwDto
    ){
        if(req.user.type != consts.LOCAL) throw new OauthException(consts.OAUTH_CANT_CHANGE_PW, consts.CHANGE_PW_ERROR_CODE);
        const {old_pw, new_pw} = changePwDto
        const email = req.user.email;
        const user = await this.authService.validateUser(email, old_pw);

        const hashedNewPassword = await this.utilService.hashPassword(new_pw);
        const updateUserDto: UpdateUserDto = {
            password: hashedNewPassword
        }
        
        const update = await this.userService.update(user.id, updateUserDto);
        return makeApiResponse(HttpStatus.OK, req.user.tokens);
    }

    //check email exists
    @SetCode(106)
    @ApiQuery({
        name: 'email',
        required: true,
        description: '확인할 이메일'
    })
    @Get('email_check')
    async checkEmail(@Param('email') email: string){
        const emailAvailable = await this.userService.checkEmailExists(email);
        const payload = {
            emailAvailable: emailAvailable
        }
        return makeApiResponse(HttpStatus.OK, payload);
    }

    //local signin - 회원가입
    @SetCode(107)
    @Post('signin')
    async signIn(@Body() createUserDto: CreateUserDto){
        const queryRunner = this.connection.createQueryRunner();
        try{
            await queryRunner.connect();
            await queryRunner.startTransaction();
            createUserDto.nickname = await this.authService.getRandomNickname();

            //bcrypt hashing
            createUserDto.password = await this.utilService.hashPassword(createUserDto.password);

            const user = await this.userService.createUser(createUserDto, queryRunner);
            const tokens = await this.authService.signIn(user, consts.LOCAL, queryRunner);

            await queryRunner.commitTransaction();
            return makeApiResponse(HttpStatus.OK, tokens);
        } catch(err){
            await queryRunner.rollbackTransaction();
            throw err;
        } finally{
            await queryRunner.release();
        }
    }

    //social signin
    @SetCode(108)
    @Post('oauth_signin')
    async oauthSignIn(@Body() oAuthSignInDto: OAuthSignInDto){
        const { 
            type, 
            oauth_access_token, 
            email, 
            terms, 
            personal_info_terms, 
            is_authenticated, 
            oauth_refresh_token 
        } = oAuthSignInDto;
        
        //check authentication with access token
        //const isValid = await this.authService.validateOAuthAccessToken(oauth_access_token, type)
        const queryRunner = this.connection.createQueryRunner();

        try{
            //make dtos
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const createUserDto: CreateUserDto = {
                nickname: await this.authService.getRandomNickname(),
                email: email,
                terms: terms,
                personal_info_terms: personal_info_terms,
                is_authenticated: is_authenticated
            };

            //check if already signed in Auth
            await this.authService.findIfUserExists(email, type, queryRunner);

            //if authenticated, check user exists.
            let user = await this.userService.findOneByEmailReturnNull(email, queryRunner);
            //if user with that email already exists, just link
            if(!user) user = await this.userService.createUser(createUserDto, queryRunner);

            const authCreateDto: Auth = {
                user: user,
                email: email,
                type: type,
                oauth_refresh_token: oauth_refresh_token
            }
            //link user to auth
            await this.authService.createAuth(authCreateDto, queryRunner);
            const tokens = await this.authService.signIn(user, type, queryRunner);

            await queryRunner.commitTransaction();
            return makeApiResponse(HttpStatus.OK, tokens);
        } catch(err){
            await queryRunner.rollbackTransaction();
            throw(err);
        } finally{
            await queryRunner.release();
        }
    }

    @SetJwtAuth()
    @SetCode(107)
    @Post('quit')
    async quit(@Request() req,){
        const email = req.user.email;
        const update = await this.userService.remove(email);
        return makeApiResponse(HttpStatus.OK);
    }
}