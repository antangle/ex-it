import { AuthorizedUser } from './../../types/user.d';
import { OAuthSignInDto } from './dto/oauth-siginin.dto';
import { ChangePwDto } from './dto/change-pw.dto';
import { LocalLoginDto } from './dto/local-login.dto';
import { UtilService } from '../util/util.service';
import { Connection } from 'typeorm';
import { Auth } from '../../entities/auth.entity';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { UserService } from 'src/module/user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../../guard/localAuth.guard';
import { Body, Controller, Get, Post, Request, UseGuards, HttpStatus, Param, Query } from '@nestjs/common';
import { CreateUserDto } from 'src/module/user/dto/create-user.dto';
import consts from 'src/consts/consts';
import { ApiResponses, makeApiResponse, SetCode, SetJwtAuth } from 'src/functions/util.functions';
import { ApiBadRequestResponse, ApiBody, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { OAuthLoginDto } from './dto/oauth-login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { BadRequestResponse, BaseOKResponse, BaseOKResponseWithTokens, InternalServerErrorResponse, UnauthorizedResponse, TokenData } from 'src/response/response.dto';
import { BadRequestCustomException } from 'src/exception/bad-request.exception';
import { CheckEmailResponse } from './response/auth.response';
import { AuthToken, AuthUser } from 'src/decorator/decorators';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private utilService: UtilService,
        private connection: Connection
    ){}

    @ApiOperation({
        summary: 'login local user',
        description: 'use oauth_login for oauth users',
    })
    @ApiBody({
        type: LocalLoginDto
    })
    @ApiResponses(BaseOKResponseWithTokens)
    @UseGuards(LocalAuthGuard)
    @SetCode(101)
    @Post('login')
    async login(@AuthUser() user: AuthorizedUser){
        const tokens = await this.authService.signIn(user);
        return makeApiResponse(HttpStatus.OK, tokens);
    }


    @ApiOperation({
        summary: 'logout user',
        description: 'compatible to both user and oauth_user',
    })
    @ApiResponses(BaseOKResponse)
    @SetJwtAuth()
    @SetCode(102)
    @Post('logout')
    async logout(@AuthUser() user: AuthorizedUser){
        //if user did oauth login
        const queryRunner = this.connection.createQueryRunner();
        try{
            await queryRunner.connect();
            await queryRunner.startTransaction();
    
            let userId = user.id;
            const updateUserDto: UpdateUserDto = {
                refresh_token: null
            }

            await this.userService.updateLocalRefreshToken(userId, updateUserDto, queryRunner);

            if(user.type != consts.LOCAL){
                const updateAuthDto: UpdateAuthDto = {
                    oauth_refresh_token: null
                }
                await this.authService.updateOAuthRefreshToken(user.email, user.type, updateAuthDto, queryRunner);
            }


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

    @ApiOperation({
        summary: 'oauth login',
        description: 'used for oauth login: naver, kakao, facebook. access_token 인증 기능은 현재 비활성화.',
    })
    @ApiResponses(BaseOKResponseWithTokens)
    @ApiBody({type: OAuthLoginDto})
    @SetCode(103)
    @Post('oauth_login')
    async oauthLogin(@Body() oauthLoginDto: OAuthLoginDto){
        //authentication with access_token
        // await this.authService.validateOAuthAccessToken(oauthLoginDto.oauth_access_token, oauthLoginDto.type);

        //if authenticated, login
        const queryRunner = this.connection.createQueryRunner();
        try{
            await queryRunner.connect();
            await queryRunner.startTransaction();

            const updateAuthDto: UpdateAuthDto = {
                oauth_refresh_token: oauthLoginDto.oauth_refresh_token
            };
            const auth = await this.authService.updateOAuthRefreshToken(oauthLoginDto.email, oauthLoginDto.type, updateAuthDto, queryRunner);
            const userId = auth[0].userId;

            let user = await this.userService.findUserById(userId, queryRunner);
            user.auth = auth;
            console.log(user);
            const tokens = await this.authService.signIn(user, oauthLoginDto.type);

            await queryRunner.commitTransaction();
            return makeApiResponse(HttpStatus.OK, {tokens});
        } catch(err){
            await queryRunner.rollbackTransaction();
            throw err;
        } finally{
            await queryRunner.release();
        }
    }


    @ApiOperation({
        summary: 'change password',
        description: 'you can only change passwords with local-login',
    })
    @ApiResponses(BaseOKResponseWithTokens)
    //you can only change passwords in local.
    @ApiBody({type: ChangePwDto})
    @SetJwtAuth()
    @SetCode(105)
    @Post('change_pw')
    async changePassword(
        @AuthToken() tokens: TokenData,
        @AuthUser() user: AuthorizedUser,
        @Body() changePwDto: ChangePwDto
    ){
        if(user.type != consts.LOCAL) throw new BadRequestCustomException(consts.OAUTH_CANT_CHANGE_PW, consts.CHANGE_PW_ERROR_CODE);
        else if(changePwDto.old_pw != changePwDto.old_pw_re) throw new BadRequestCustomException(consts.PASSWORD_NOT_MATCH, consts.PASSWORD_NOT_MATCH_CODE);

        const {old_pw, new_pw} = changePwDto;
        const email = user.email;
        await this.authService.validateUser(email, old_pw);

        const hashedNewPassword = await this.utilService.hashPassword(new_pw);
        const updateUserDto: UpdateUserDto = {
                password: hashedNewPassword
        }

        await this.userService.update(user.id, updateUserDto);
        return makeApiResponse(HttpStatus.OK, {tokens});
    }

    @ApiOperation({
        summary: 'check if email exists',
        description: 'true if email is available. false otherwise',
    })
    @ApiResponses(CheckEmailResponse)
    //check email exists
    @SetCode(106)
    @ApiQuery({
        name: 'email',
        required: true,
        description: '확인할 이메일'
    })
    @Get('email_check')
    async checkEmail(@Query('email') email: string){
        const available = await this.userService.checkEmailExists(email);
        const payload = {
            available: available
        }
        return makeApiResponse(HttpStatus.OK, {payload});
    }


    @ApiOperation({
        summary: '회원가입',
        description: 'local user 회원가입',
    })
    @ApiResponses(BaseOKResponseWithTokens)
    @ApiBody({
        type: CreateUserDto
    })
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
            return makeApiResponse(HttpStatus.OK, {tokens});
        } catch(err){
            await queryRunner.rollbackTransaction();
            throw err;
        } finally{
            await queryRunner.release();
        }
    }


    @ApiOperation({
        summary: '소셜 회원가입',
        description: 'oauth user 회원가입',
    })
    @ApiResponses(BaseOKResponseWithTokens)
    @ApiBody({
        type: OAuthSignInDto
    })
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

        const queryRunner = this.connection.createQueryRunner();
        
        try{
            await queryRunner.connect();
            await queryRunner.startTransaction();

            const createUserDto: CreateUserDto = {
                nickname: await this.authService.getRandomNickname(),
                email: email,
                terms: terms,
                personal_info_terms: personal_info_terms,
                is_authenticated: is_authenticated
            };

            //check authentication with access token
            //const isValid = await this.authService.validateOAuthAccessToken(oauth_access_token, type)

            //if authenticated, check user exists.
            let user = await this.userService.findOneByEmailReturnNull(email, queryRunner);
            
            //if user does not exist, create that user.
            if(!user) user = await this.userService.createUser(createUserDto, queryRunner);
            
            //if user with that email already exists, just link
            const authCreateDto: Auth = {
                user: user,
                email: email,
                type: type,
                oauth_refresh_token: oauth_refresh_token
            }

            //link user to auth
            const auth = await this.authService.createAuth(authCreateDto, queryRunner);
            user.auth = [auth];
            const tokens = await this.authService.signIn(user, type, queryRunner);
            await queryRunner.commitTransaction();
            return makeApiResponse(HttpStatus.OK, {tokens});
        } catch(err){
            await queryRunner.rollbackTransaction();
            throw(err);
        } finally{
            await queryRunner.release();
        }
    }

    @ApiOperation({
        summary: '회원탈퇴',
        description: 'soft delete 회원탈퇴',
    })
    @ApiResponses(BaseOKResponse)
    @SetJwtAuth()
    @SetCode(107)
    @Post('quit')
    async quit(@Request() req){
        const email = req.user.email;
        const del = await this.userService.softDelete(email);
        return makeApiResponse(HttpStatus.OK);
    }
}