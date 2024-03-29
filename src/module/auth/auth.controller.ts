import { MainService } from './../main/main.service';
import { TransactionInterceptor } from './../../interceptor/transaction.interceptor';
import { CheckEmailDto } from './dto/check-email.dto';
import { TooManyRequestException } from './../../exception/bad-request.exception';
import { RedisService } from './../redis/redis.service';
import { VerifyDto, VerifyRequestDto } from './dto/verify.dto';
import { AuthorizedUser, VerifyCache } from './../../types/user.d';
import { OAuthSignInDto } from './dto/oauth-siginin.dto';
import { ChangePwDto } from './dto/change-pw.dto';
import { LocalLoginDto } from './dto/local-login.dto';
import { UtilService } from '../util/util.service';
import { Connection, QueryRunner } from 'typeorm';
import { Auth } from '../../entities/auth.entity';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { UserService } from 'src/module/user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../../guard/localAuth.guard';
import { Body, Controller, Get, Post, Request, UseGuards, HttpStatus, Param, Query } from '@nestjs/common';
import { CreateUserDto } from 'src/module/user/dto/create-user.dto';
import { consts } from 'src/consts/consts';
import { ApiResponses, makeApiResponse, SetCode, SetJwtAuth } from 'src/functions/util.functions';
import { ApiBody, ApiOperation, ApiTags, ApiTooManyRequestsResponse } from '@nestjs/swagger';
import { OAuthLoginDto } from './dto/oauth-login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { BaseOKResponse, BaseOKResponseWithTokens, TokenData, TooManyRequestResponse } from 'src/response/response.dto';
import { BadRequestCustomException } from 'src/exception/bad-request.exception';
import { CheckEmailResponse } from './response/auth.response';
import { AuthToken, AuthUser, TransactionQueryRunner } from 'src/decorator/decorators';
import { VerifyResponse } from './response/verify.response';
import { LoginResponse } from './response/login.response';
import { DataLoggingService } from 'src/logger/logger.service';
import { UseInterceptors } from '@nestjs/common/decorators';
import { NotOperationTimeException } from 'src/exception/noOperationTime.exception';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private redisService: RedisService,
        private userService: UserService,
        private utilService: UtilService,
        private mainService: MainService,
        private connection: Connection,
        private readonly dataLoggingService: DataLoggingService,
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
        //log data at the end of api
        this.dataLoggingService.login(user);
        return makeApiResponse(HttpStatus.OK, {tokens, nickname: user.nickname});
    }

    @ApiOperation({
        summary: 'logout user',
        description: 'compatible to both user and oauth_user',
    })
    @ApiResponses(BaseOKResponse)
    @UseInterceptors(TransactionInterceptor)
    @SetJwtAuth()
    @SetCode(102)
    @Post('logout')
    async logout(
        @AuthUser() user: AuthorizedUser,
        @TransactionQueryRunner() queryRunner: QueryRunner
        ){
        //if user did oauth login
        
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
        //log data at the end of api
        this.dataLoggingService.logout(user);
        return makeApiResponse(HttpStatus.OK);
    }

    @ApiOperation({
        summary: 'oauth login',
        description: 'used for oauth login: naver, kakao, facebook. access_token 인증 기능은 현재 비활성화.',
    })
    @ApiResponses(LoginResponse)
    @ApiBody({type: OAuthLoginDto})
    @UseInterceptors(TransactionInterceptor)
    @SetCode(103)
    @Post('oauth_login')
    async oauthLogin(
        @Body() oauthLoginDto: OAuthLoginDto,
        @TransactionQueryRunner() queryRunner: QueryRunner
        ){

        //authentication with access_token
        // await this.authService.validateOAuthAccessToken(oauthLoginDto.oauth_access_token, oauthLoginDto.type);

        //if authenticated, login
    
        const updateAuthDto: UpdateAuthDto = {
            oauth_refresh_token: oauthLoginDto.oauth_refresh_token
        };
        const auth = await this.authService.updateOAuthRefreshToken(oauthLoginDto.email, oauthLoginDto.type, updateAuthDto, queryRunner);
        const userId = auth[0].userId;

        let user = await this.userService.findUserById(userId, queryRunner);
        user.auth = auth;

        const tokens = await this.authService.signIn(user, oauthLoginDto.type);

        //log data at the end of api
        this.dataLoggingService.login(user, oauthLoginDto.type);
        return makeApiResponse(HttpStatus.OK, {tokens, nickname: user.nickname});
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
        else if(changePwDto.new_pw != changePwDto.new_pw_re) throw new BadRequestCustomException(consts.NEW_PW_NOT_MATCH, consts.PASSWORD_NOT_MATCH_CODE);

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
        summary: '이메일 존재 유무 체크',
        description: '이메일이 사용 가능하면 true. 이메일이 이미 존재하면 false.',
    })
    @ApiResponses(CheckEmailResponse)
    //check email exists
    @SetCode(106)
    @ApiBody({
        type: CheckEmailDto
    })
    @Post('email_check')
    async checkEmail(@Body() checkEmailDto: CheckEmailDto){
        const available = await this.userService.checkEmailExists(checkEmailDto.email);
        const payload = {
            available: available
        }
        return makeApiResponse(HttpStatus.OK, payload);
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
    @UseInterceptors(TransactionInterceptor)
    @SetCode(107)
    @Post('signin')
    async signIn(
        @Body() createUserDto: CreateUserDto,
        @TransactionQueryRunner() queryRunner: QueryRunner
        ){
    
        createUserDto.nickname = await this.authService.getRandomNickname();

        //bcrypt hashing
        createUserDto.password = await this.utilService.hashPassword(createUserDto.password);

        const user = await this.userService.createUser(createUserDto, queryRunner);
        const tokens = await this.authService.signIn(user, consts.LOCAL, queryRunner);

        //log data at the end of api
        this.dataLoggingService.signin(user);
        return makeApiResponse(HttpStatus.OK, {tokens, nickname: user.nickname});
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
    @UseInterceptors(TransactionInterceptor)
    @SetCode(108)
    @Post('oauth_signin')
    async oauthSignIn(
        @Body() oAuthSignInDto: OAuthSignInDto,
        @TransactionQueryRunner() queryRunner: QueryRunner
        ){
        let {
            type, 
            oauth_access_token,
            sex,
            birth,
            email,
            terms,
            personal_info_terms,
            oauth_refresh_token
        } = oAuthSignInDto;

        if(!birth) birth = null;
        if(!sex) sex = null;
        
        //check authentication with access token
        //const isValid = await this.authService.validateOAuthAccessToken(oauth_access_token, type)

        //if authenticated, check user exists.
        let user = await this.userService.findOneByEmailReturnNull(email, queryRunner);
        
        //if user does not exist, create that user.
        if(!user) {
            const createUserDto: CreateUserDto = {
                nickname: await this.authService.getRandomNickname(),
                sex: sex,
                birth: birth,
                email: email,
                terms: terms,
                personal_info_terms: personal_info_terms,
                is_authenticated: true //isValid
            };
            user = await this.userService.createUser(createUserDto, queryRunner);
        }
        console.log(birth, sex);
        const nickname = user.nickname;
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

        //log data at the end of api
        this.dataLoggingService.signin(user, type, birth, sex);

        return makeApiResponse(HttpStatus.OK, {tokens, nickname: nickname});
    }

    @ApiOperation({
        summary: '회원탈퇴',
        description: 'soft delete 회원탈퇴. 5일후에 자동으로 서버에서 삭제됨',
    })
    @ApiResponses(BaseOKResponse)
    @UseInterceptors(TransactionInterceptor)
    @SetJwtAuth()
    @SetCode(109)
    @Post('quit')
    async quit(
        @AuthUser() user: AuthorizedUser,
        @TransactionQueryRunner() queryRunner: QueryRunner
    ){
        const userId = user.id;
        await this.authService.quit(userId, queryRunner);

        this.dataLoggingService.quit(user);
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
        const isCacheExist = await this.redisService.getPhoneVerificationCache(verifyRequestDto.phone);
        if(isCacheExist) throw new TooManyRequestException(consts.TOO_MANY_REQUESTS, consts.VERIFY_REQUEST_ERR_CODE)

        // send sms message with verification number
        await this.utilService.sendSmsMessage(verifyRequestDto.phone, randomNumber);
        
        // save number: randomNumber in cache
        const verifyCache: VerifyCache = {
            verifyNumber: randomNumber,
            time: Date.now()
        }

        await this.redisService.setPhoneVerificationCache(verifyRequestDto.phone, verifyCache);

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
        const isCacheExist = await this.redisService.getPhoneVerificationCache(verifyRequestDto.phone);
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

        await this.redisService.setPhoneVerificationCache(verifyRequestDto.phone, verifyCache);

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
        const verifyCache = await this.redisService.getPhoneVerificationCache(verifyDto.phone);
        let isVerified: boolean;
        if(verifyCache == null) isVerified = false;
        else isVerified = verifyCache.verifyNumber == verifyDto.verify_number;
        return makeApiResponse(HttpStatus.OK, {is_verified: isVerified});
    }
}