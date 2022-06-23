import { UserService } from 'src/user/user.service';
import { randomUUID } from 'crypto';
import { JwtAuthGuard } from './authguard/jwtAuth.guard';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './authguard/localAuth.guard';
import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private userService: UserService
    ){}
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req){
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req){
        return req.user;
    }

    @Post('check')
    async checkEmail(@Body('email') email: string){
        const isEmailExist = await this.authService.checkEmailExists(email);
        return isEmailExist;
    }

    @Post('signin')
    async signIn(@Body() createUserDto: CreateUserDto){
        createUserDto.nickname = randomUUID();

        //bcrypt hashing
        createUserDto.password = await this.userService.hashUserDto(createUserDto.password);

        const user = await this.userService.create(createUserDto);
        return this.authService.login(user);
    }
}