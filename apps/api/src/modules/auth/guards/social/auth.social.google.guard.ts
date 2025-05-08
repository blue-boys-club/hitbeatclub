import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { TokenPayload } from 'google-auth-library';
import { AUTH_SOCIAL_GOOGLE_ERROR } from 'src/modules/auth/auth.error';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class AuthSocialGoogleGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<IRequestApp<TokenPayload>>();
    const { authorization } = request.headers;
    const acArr = authorization?.split('Bearer ') ?? [];

    if (acArr.length !== 2) {
      throw new UnauthorizedException({
        statusCode: AUTH_SOCIAL_GOOGLE_ERROR.code,
        message: 'auth.error.socialGoogle',
      });
    }

    const code: string = acArr[1];

    try {
      const tokens = await this.authService.googleGetToken(code);
      if (!tokens.id_token) {
        throw new UnauthorizedException({
          statusCode: AUTH_SOCIAL_GOOGLE_ERROR.code,
          message: 'Invalid Google token',
        });
      }
      const tokenPayload: TokenPayload =
        await this.authService.googleVerifyIdToken(tokens.id_token);
      request.user = { ...tokenPayload, ...tokens } as any;

      return true;
    } catch (e: any) {
      if (e?.response) {
        throw new UnauthorizedException(e.response);
      }
      throw new UnauthorizedException({
        statusCode: AUTH_SOCIAL_GOOGLE_ERROR.code,
        message: e.message,
      });
    }
  }
}
