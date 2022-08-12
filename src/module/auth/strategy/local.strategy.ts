import { UnauthorizedUserException } from './../../../exception/unauthorized.exception';
import { DatabaseException } from './../../../exception/database.exception';
import { User } from 'src/entities/user.entity';
import { AuthService } from '../auth.service';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { consts } from 'src/consts/consts';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new UnauthorizedUserException(consts.TARGET_NOT_EXIST, consts.LOCAL_STRATEGY_ERROR_CODE);
    return user;
  }
}