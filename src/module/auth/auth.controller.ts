import { OnlyTokenDto } from './dto/refresh.dto';
import { LocalLoginDto } from './dto/local-login.dto';
import { CustomError } from '../../exception/custom.exception';
import { UtilService } from '../util/util.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateResult, TypeORMError } from 'typeorm';
import { Auth } from '../../entities/auth.entity';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { UserService } from 'src/module/user/user.service';
import { JwtAuthGuard } from '../../guard/jwtAuth.guard';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../../guard/localAuth.guard';
import { Body, Controller, Get, Post, Request, UseFilters, UseGuards, HttpException, HttpStatus, Req } from '@nestjs/common';
import { CreateUserDto } from 'src/module/user/dto/create-user.dto';
import consts from 'src/consts/consts';
import { CustomFilter } from 'src/filter/typeorm.filter';
import { makeApiResponse, SetCode } from 'src/functions/util.functions';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiTags } from '@nestjs/swagger';
import { OAuthLoginDto } from './dto/oauth-login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private utilService: UtilService
    ){}

    //!
    @SetCode(101)
    @ApiBody({type: LocalLoginDto})
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req){
        const tokens = await this.authService.signIn(req.user);
        return makeApiResponse(HttpStatus.OK, tokens);
    }
    
    @SetCode(102)
    @ApiBody({type: OnlyTokenDto})
    @ApiBearerAuth('access_token')
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Request() req){
        //oauth logic required
        if(req.user.type != consts.LOCAL){
            const user = await this.authService.removeOAuthRefreshToken(req.user.email, req.user.type);
            console.log(user);
        }
        const temp = await this.userService.removeLocalRefreshToken(req.user.email);
        console.log('update', temp);
        
        return req.tokens;
    }
    
    @SetCode(103)
    @ApiBody({type: OAuthLoginDto})
    @Post('oauth_login')
    async oauthLogin(@Body() oauthLoginDto: OAuthLoginDto){
        //authentication with access_token

        //if authenticated, login
        const updateResult: UpdateResult = await this.authService.saveOAuthRefreshToken(oauthLoginDto);
        if(updateResult.affected != 1){
            throw new HttpException('refresh token save failed', HttpStatus.UNAUTHORIZED);
        }

        const userId = updateResult.raw[0].userId;
        
        const user = await this.userService.findOne(userId);
        
        return this.authService.signIn(user, oauthLoginDto.type);
    }


    @SetCode(104)
    //if access token is invalid, filter catches and redirect to refresh.
    @ApiBearerAuth('access_token')
    @UseGuards(JwtAuthGuard)
    @Post('profile')
    getProfile(@Request() req){
        return req.user;
    }

    @SetCode(105)
    //you can only change passwords in local.
    @ApiBearerAuth('access_token')
    @UseGuards(JwtAuthGuard)
    @Post('change_pw')
    async changePassword(
        @Request() req,
        @Body('old_pw') oldPw: string,
        @Body('new_pw') newPw: string
    ){
        if(req.user.type != consts.LOCAL){
            throw new CustomError('oauth cant change pw', 1);
        }
        const email = req.user.email;
        const match = await this.authService.validateUser(email, oldPw);
        if(!match){
            throw new CustomError('password not match', 2);
        }
        
        const hashedNewPassword = await this.utilService.hashPassword(newPw);
        const updateUserDto: UpdateUserDto = {
            password: hashedNewPassword
        }
        
        const update = await this.userService.updateByEmail(email, updateUserDto);
        if(!update){
            throw new HttpException('update failed', HttpStatus.UNAUTHORIZED);
        }
        return update;
    }

    @SetCode(106)
    //check email exists
    @Post('email_check')
    async checkEmail(@Body('email') email: string){
        const isEmailExist = await this.userService.checkEmailExists(email);
        return isEmailExist;
    }
    
    @SetCode(107)
    //local signin - 회원가입
    @Post('signin')
    async signIn(@Body() createUserDto: CreateUserDto){
        createUserDto.nickname = this.utilService.makeRandomNickname();
        
        //bcrypt hashing
        createUserDto.password = await this.utilService.hashPassword(createUserDto.password);
        
        const user = await this.userService.create(createUserDto);
        return this.authService.signIn(user);
    }

    @SetCode(108)
    //social signin
    @Post('oauth_signin')
    @UseFilters(CustomFilter)
    async oauthSignIn(
        @Body('email') email: string,
        @Body('access_token') accessToken: string,
        @Body('refresh_token') refreshToken: string,
        @Body('type') type: string,
        @Body('terms') terms: boolean,
        @Body('personal_info_terms') personalInfoTerms: boolean,
        @Body('is_authenticated') isAuthenticated: boolean,
    ){
        //check authentication with access token
        if(!await this.authService.validateOAuthAccessToken(type, accessToken)){
            throw new CustomError('oauth access token invalid', 1);
        }

        //make dtos
        const createUserDto: CreateUserDto = {
            nickname: await this.authService.getRandomNickname(),
            email: email,
            terms: terms,
            personal_info_terms: personalInfoTerms,
            is_authenticated: isAuthenticated
        }
        
        //check if already signed in Auth
        const auth: Auth = await this.authService.findOne(email, type);
        if(auth){
            throw new CustomError(`${auth.type} already exists`, 2);
        }

        //if authenticated, check user exists.
        let user = await this.userService.findOneByEmail(email);
        //if user with that email already exists, just link
        if(!user){
            console.log('hi!');
            user = await this.userService.create(createUserDto);
        }

        const authCreateDto: Auth = {
            user: user,
            email: email,
            type: type, 
            refresh_token: refreshToken
        }
        await this.authService.create(authCreateDto);

        //link user to auth
        return await this.authService.signIn(user, type);
    }
}