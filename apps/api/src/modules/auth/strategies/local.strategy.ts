import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { AUTH_LOGIN_ERROR } from '../auth.error';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'phoneNumber',
      passwordField: 'phoneNumber',
      passReqToCallback: false,
    });
  }

  async validate(phoneNumber: string): Promise<any> {
    try {
    } catch (e: any) {
      throw new BadRequestException(e.response);
    }
  }
}
