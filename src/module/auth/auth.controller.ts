import { TooManyRequestException } from './../../exception/bad-request.exception';
import { RedisService } from './../redis/redis.service';
import { VerifyDto, VerifyRequestDto } from './dto/verify.dto';
import { AuthorizedUser, VerifyCache } from './../../types/user.d';
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
import { ApiBadRequestResponse, ApiBody, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags, ApiTooManyRequestsResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { OAuthLoginDto } from './dto/oauth-login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { BadRequestResponse, BaseOKResponse, BaseOKResponseWithTokens, InternalServerErrorResponse, UnauthorizedResponse, TokenData, TooManyRequestResponse } from 'src/response/response.dto';
import { BadRequestCustomException } from 'src/exception/bad-request.exception';
import { CheckEmailResponse } from './response/auth.response';
import { AuthToken, AuthUser } from 'src/decorator/decorators';
import { VerifyResponse } from './response/verify.response';
import { LoginResponse } from './response/login.response';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private redisService: RedisService,
        private userService: UserService,
        private utilService: UtilService,
        private connection: Connection
    ){}

    @Post('login')
    @ApiOperation({
        summary: 'login local user',
        description: 'use oauth_login for oauth users',
    })
    @ApiBody({
        type: LocalLoginDto
    })
    @ApiResponses(LoginResponse)
    @UseGuards(LocalAuthGuard)
    @SetCode(101)
    async login(@AuthUser() user: AuthorizedUser){
        const tokens = await this.authService.signIn(user);
        return makeApiResponse(HttpStatus.OK, {tokens, nickname: user.nickname});
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
    @ApiResponses(LoginResponse)
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

            const tokens = await this.authService.signIn(user, oauthLoginDto.type);

            await queryRunner.commitTransaction();
            return makeApiResponse(HttpStatus.OK, {tokens, nickname: user.nickname});
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
    @ApiResponses(LoginResponse)
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
            console.log(user);
            const tokens = await this.authService.signIn(user, consts.LOCAL, queryRunner);

            await queryRunner.commitTransaction();
            return makeApiResponse(HttpStatus.OK, {tokens, nickname: user.nickname});
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
    @ApiResponses(LoginResponse)
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
            oauth_refresh_token 
        } = oAuthSignInDto;

        const queryRunner = this.connection.createQueryRunner();
        
        try{
            await queryRunner.connect();
            await queryRunner.startTransaction();
            
            //check authentication with access token
            //const isValid = await this.authService.validateOAuthAccessToken(oauth_access_token, type)
            const createUserDto: CreateUserDto = {
                nickname: await this.authService.getRandomNickname(),
                email: email,
                terms: terms,
                personal_info_terms: personal_info_terms,
                is_authenticated: true //isValid
            };


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
            return makeApiResponse(HttpStatus.OK, {tokens, username: user.nickname});
        } catch(err){
            await queryRunner.rollbackTransaction();
            throw(err);
        } finally{
            await queryRunner.release();
        }
    }

    @ApiOperation({
        summary: '회원탈퇴',
        description: 'soft delete 회원탈퇴. 5일후에 자동으로 서버에서 삭제됨',
    })
    @ApiResponses(BaseOKResponse)
    @SetJwtAuth()
    @SetCode(109)
    @Post('quit')
    async quit(@Request() req){
        const email = req.user.email;
        await this.userService.softDelete(email);
        return makeApiResponse(HttpStatus.OK);
    }


    @ApiOperation({
        summary: '휴대폰 본인인증 인증번호 요청',
        description: '성공시 해당 휴대번호로 문자 메시지 전송',
    })
    @ApiResponses(BaseOKResponse)
    @ApiTooManyRequestsResponse({
        type: TooManyRequestResponse
    })
    @ApiBody({
        type: VerifyRequestDto
    })
    @SetCode(110)
    @Post('verify_request')
    async sendVerificationNumber(@Body() verifyRequestDto: VerifyRequestDto){
        // generate verification number
        const randomNumber = this.utilService.make4RandomDigit();

        //if sms already sent, send Too Many Request Exception
        const isCacheExist = await this.redisService.get(verifyRequestDto.phone);
        if(isCacheExist) throw new TooManyRequestException(consts.TOO_MANY_REQUESTS, consts.VERIFY_REQUEST_ERR_CODE)

        // send sms message with verification number
        await this.utilService.sendSmsMessage(verifyRequestDto.phone, randomNumber);
        
        // save number: randomNumber in cache
        const verifyCache: VerifyCache = {
            verifyNumber: randomNumber,
            time: Date.now()
        }

        await this.redisService.set(verifyRequestDto.phone, verifyCache);

        return makeApiResponse(HttpStatus.OK);
    }
    
    @ApiOperation({
        summary: '휴대폰 본인인증 인증번호 재인증 요청',
        description: '성공시 해당 휴대번호로 문자 메시지 전송',
    })
    @ApiResponses(BaseOKResponse)
    @ApiTooManyRequestsResponse({
        type: TooManyRequestResponse
    })
    @ApiBody({
        type: VerifyRequestDto
    })
    @SetCode(110)
    @Post('verify_request_re')
    async sendVerificationNumberAgain(@Body() verifyRequestDto: VerifyRequestDto){
        // generate verification number
        const randomNumber = this.utilService.make4RandomDigit();

        
        //10초 후까지 재인증 막아놓기
        const isCacheExist = await this.redisService.get(verifyRequestDto.phone);
        if(isCacheExist){
            const seconds = (Date.now() - isCacheExist.time)/1000;
            if(seconds < 10) throw new TooManyRequestException(consts.TOO_MANY_REQUESTS, consts.VERIFY_REQUEST_ERR_CODE);
        } 

        // send sms message with verification number
        await this.utilService.sendSmsMessage(verifyRequestDto.phone, randomNumber);
        
        // save number: randomNumber in cache
        const verifyCache: VerifyCache = {
            verifyNumber: randomNumber,
            time: Date.now()
        }

        await this.redisService.set(verifyRequestDto.phone, verifyCache);

        return makeApiResponse(HttpStatus.OK);
    }

    @ApiOperation({
        summary: '휴대폰 본인인증',
        description: '서버에서 해당 전화번호와 매칭되는 인증번호 판단, 인증시 true, else false',
    })
    @ApiResponses(VerifyResponse)
    @ApiBody({
        type: VerifyDto
    })
    @SetCode(110)
    @Post('verify')
    async verifyPhoneNumber(@Body() verifyDto: VerifyDto){
        const verifyCache = await this.redisService.get(verifyDto.phone);
        console.log(verifyCache);
        let isVerified: boolean;
        if(verifyCache == null) isVerified = false;
        else isVerified = verifyCache.verifyNumber == verifyDto.verify_number;
        return makeApiResponse(HttpStatus.OK, {is_verified: isVerified});
    }
}