import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthJwtAccessPayloadDto } from './dto/request/auth.jwt.access-payload.dto';
import {
  AUTH_FIND_GOOGLE_TOKEN_ERROR,
  AUTH_VERIFY_ID_TOKEN_ERROR,
} from './auth.error';
import { LoginTicket, OAuth2Client, TokenPayload } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { AuthGoogleLoginResponseDto } from './dto/response/auth.google.login.response.dto';
import { HelperEncryptionService } from 'src/common/helper/services/helper.encryption.service';
import { ENUM_EMAIL } from '../email/constants/email.enum.constant';
import { IAuthHash } from './interfaces/auth.interface';
import { HelperHashService } from 'src/common/helper/services/helper.hash.service';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';

@Injectable()
export class AuthService {
  // google
  private readonly googleClient: OAuth2Client;

  private readonly hashInfo: object;

  constructor(
    private readonly helperHashService: HelperHashService,
    private readonly helperDateService: HelperDateService,
    private readonly configService: ConfigService,
    private readonly helperEncryptionService: HelperEncryptionService,
  ) {
    // google
    this.googleClient = new OAuth2Client(
      this.configService.get<string>('auth.google.clientId'),
      this.configService.get<string>('auth.google.clientSecret'),
      'postmessage',
    );

    this.hashInfo = {
      [ENUM_EMAIL.CHANGE_PASSWORD]: {
        expiredIn: this.configService.get<number>('auth.password.expiredIn'),
        saltLength: this.configService.get<number>('auth.password.saltLength'),
      },
      [ENUM_EMAIL.EMAIL]: {
        expiredIn: this.configService.get<number>('auth.email.expiredIn'),
        saltLength: this.configService.get<number>('auth.email.saltLength'),
      },
      [ENUM_EMAIL.SIGN_UP]: {
        signUp: this.configService.get<number>('auth.email.signUp'),
        saltLength: this.configService.get<number>('auth.signUp.saltLength'),
      },
    };
  }

  validateUser(payload: AuthJwtAccessPayloadDto) {
    return payload;
  }

  async googleGetToken(code) {
    try {
      const { tokens } = await this.googleClient.getToken(code);
      /**
         tokens response
         {
            access_token: 'ya29.a0AcM612z5bGS_xAEHFamNYzsT8RukJ2FdtSNedr9gDeA4i0CdViSheHUzzl0RgPMGBeY82XF34u-SRebQbXn87kPCGl5CDWkcjLGjGV8WyQgpxGLlvlaivbORpFC2oGPnaaM0jmxSuGQXAsD853SOM51FrNRcF09M5q9hAfLOaCgYKAeYSARMSFQHGX2MiwHeGq6VxNcLF_9aoOYMm1A0175',
            refresh_token: '1//0eI5lHl8y5CUKCgYIARAAGA4SNwF-L9Ir8nRXKJtlnJnyMtFyS3zB3HXR1Jh3OOeTTPsmZ9uO_LlE_QiyQ5XB4ywzhlAmWWxcRgI',
            scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly openid https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.profile',
            token_type: 'Bearer',
            id_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjI4YTQyMWNhZmJlM2RkODg5MjcxZGY5MDBmNGJiZjE2ZGI1YzI0ZDQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2NzE4NDU4NTQ4NzctdWY4aWhqcGRnNjBrdnBhdm8yMjFva3BlZjV0ODZwMHIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2NzE4NDU4NTQ4NzctdWY4aWhqcGRnNjBrdnBhdm8yMjFva3BlZjV0ODZwMHIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDMzNDUzMjA0OTQ2NDQzMDIwMzAiLCJoZCI6ImluZGVlcGFpLmNvLmtyIiwiZW1haWwiOiJkaC5sZWVAaW5kZWVwYWkuY28ua3IiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6Ik9TMXhCRHlkeW5LNHJjdlhKcGM4VWciLCJuYW1lIjoi7J2064uk7ZuIIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0wtVWZRY1VwMldWTXJOU1c4RE00Y3pkUXRFazdJQnNZc045Ty1OeVNKRHk0NnBPQT1zOTYtYyIsImdpdmVuX25hbWUiOiLri6Ttm4giLCJmYW1pbHlfbmFtZSI6IuydtCIsImlhdCI6MTcyNzkzODE1NywiZXhwIjoxNzI3OTQxNzU3fQ.AHhtUN25wo5DXNwrJINb8Uo1PFqTWVw5x8YheHFEzdv-XCD-N9BxM5jJWpQWf4cYgN2bGs3DF9Z0ahniMs_fJj07dPBXyLOxeYo2HCfvurcDpf89fxNeltOjQUV81OBjpfiHXN-OWjKPkJxEP7uHNzIBFFTFJLyvtgw3O_ybbybJbVOCrtmWkFYE88GFO1ZroCAbixsCj3bg8MLVieZE4WJtQ-9jYnwMTq-lSgL7IEjYEhu0ZdHrXEqXolbCoq5VP-KCCoeb5VRIpQZvHidS8s5Kkr9Y_KDJPCpn55NfuV8V5mDGE2HPpSNfZ3rCUEe7XD4SHKjVixRvqyJJ5EC1nA',
            expiry_date: 1727941756694
        }
         */

      return tokens;
    } catch (e) {
      throw new BadRequestException({
        ...AUTH_FIND_GOOGLE_TOKEN_ERROR,
        message: e.message,
      });
    }
  }

  async googleVerifyIdToken(idToken: string): Promise<TokenPayload> {
    try {
      const login: LoginTicket = await this.googleClient.verifyIdToken({
        idToken,
      });

      const payload = login.getPayload();
      if (!payload) {
        throw new BadRequestException({
          ...AUTH_VERIFY_ID_TOKEN_ERROR,
          message: 'Invalid token payload',
        });
      }
      return payload;
    } catch (e) {
      throw new BadRequestException({
        ...AUTH_VERIFY_ID_TOKEN_ERROR,
        message: e.message,
      });
    }
  }

  async googleLogin(code: string): Promise<AuthGoogleLoginResponseDto> {
    try {
      // 1. Get Google tokens
      const tokens = await this.googleGetToken(code);
      if (!tokens.id_token) {
        throw new BadRequestException('Invalid Google token');
      }

      // 2. Verify ID token
      const tokenPayload = await this.googleVerifyIdToken(tokens.id_token);

      // 3. Generate JWT tokens
      const accessToken = this.helperEncryptionService.jwtEncrypt(
        { email: tokenPayload.email },
        {
          secretKey: this.configService.get('auth.jwt.secretKey'),
          expiredIn: '7d',
          audience: this.configService.get('auth.jwt.audience'),
          issuer: this.configService.get('auth.jwt.issuer'),
          subject: this.configService.get('auth.jwt.subject'),
        },
      );

      const refreshToken = this.helperEncryptionService.jwtEncrypt(
        { email: tokenPayload.email },
        {
          secretKey: this.configService.get('JWT_SECRET'),
          expiredIn: '30d',
          audience: this.configService.get('auth.jwt.audience'),
          issuer: this.configService.get('auth.jwt.issuer'),
          subject: this.configService.get('auth.jwt.subject'),
        },
      );

      return {
        accessToken,
        refreshToken,
        email: tokenPayload.email || '',
        name: tokenPayload.name || '',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createSalt(length: number): Promise<string> {
    return this.helperHashService.randomSalt(length);
  }

  /**
   * 해시 정보 생성
   * @param type
   * @param text
   * @returns
   */
  async createHashInfo(type: ENUM_EMAIL, text: string): Promise<IAuthHash> {
    const salt: string = await this.createSalt(this.hashInfo[type].saltLength);
    const expired: Date = this.helperDateService.forwardInSeconds(
      this.hashInfo[type].expiredIn,
    );

    const created: Date = this.helperDateService.create();
    const hash = this.helperHashService.bcrypt(text, salt);

    return {
      hash,
      expired,
      hashCreated: created,
      salt,
    };
  }
}
