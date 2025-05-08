import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AUTH_LOGIN_ERROR, AUTH_TOKEN_EXPIRED_ERROR } from '../auth.error';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private moduleRef: ModuleRef,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Header에 토큰을 제공하는 방식
      ignoreExpiration: true, // false: 만료된 토큰은 거부 (401)
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true, // request 객체를 콜백에 전달
    });
  }

  async validate(request: Request | any, payload: any) {
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException({
        title: '토큰이 없습니다.',
        code: '1000',
        status: 401,
      });
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch (e) {
      if (e.message.includes('jwt expired')) {
        // 로그아웃이면 토큰 만료 에러를 return 하지 않고 로그아웃 처리
        if (request.originalUrl !== '/v1/auth/logout') {
          throw new UnauthorizedException({
            ...AUTH_TOKEN_EXPIRED_ERROR,
            detail: e.message,
          });
        }
      } else {
        throw new UnauthorizedException({
          ...AUTH_LOGIN_ERROR,
          detail: e.message,
        });
      }
    }

    const contextId = ContextIdFactory.getByRequest(request);
    const authService = await this.moduleRef.resolve(AuthService, contextId);
    return await authService.validateUser(payload.email);
  }

  private extractTokenFromHeader(request: Request | any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
