import { User } from 'src/entities/user.entity';
import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService        
    ){}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findOneByEmail(email);
        if(!user) return null;
        let isPasswordMatch = await bcrypt.compare(password, user.password);
        
        if(isPasswordMatch){
            const { password, ...result } = user;
            return result
        }
        return null;
    }

    async login(user: User){
        const payload = {
            email: user.email,
            nickname: user.nickname
        };

        return {
            access_token: this.jwtService.sign(payload)
        };
    }
}
