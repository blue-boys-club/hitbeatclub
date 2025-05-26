import { BadRequestException, Injectable } from "@nestjs/common";
import { AuthJwtAccessPayloadDto } from "./dto/request/auth.jwt.access-payload.dto";
import { AUTH_FIND_GOOGLE_TOKEN_ERROR, AUTH_LOGIN_OR_SIGNUP_ERROR, AUTH_VERIFY_ID_TOKEN_ERROR } from "./auth.error";
import { LoginTicket, OAuth2Client, TokenPayload } from "google-auth-library";
import { ConfigService } from "@nestjs/config";
import { AuthLoginResponse } from "@hitbeatclub/shared-types/auth";
import { HelperEncryptionService } from "src/common/helper/services/helper.encryption.service";
import { ENUM_EMAIL } from "../email/constants/email.enum.constant";
import { IAuthHash } from "./interfaces/auth.interface";
import { HelperHashService } from "src/common/helper/services/helper.hash.service";
import { HelperDateService } from "src/common/helper/services/helper.date.service";
import { UserService } from "../user/user.service";
import { AuthenticatedRequest } from "./dto/request/auth.dto.request";

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
		private readonly userService: UserService,
	) {
		// google
		this.googleClient = new OAuth2Client(
			this.configService.get<string>("auth.google.clientId"),
			this.configService.get<string>("auth.google.clientSecret"),
			"postmessage",
		);

		this.hashInfo = {
			[ENUM_EMAIL.CHANGE_PASSWORD]: {
				expiredIn: this.configService.get<number>("auth.password.expiredIn"),
				saltLength: this.configService.get<number>("auth.password.saltLength"),
			},
			[ENUM_EMAIL.EMAIL]: {
				expiredIn: this.configService.get<number>("auth.email.expiredIn"),
				saltLength: this.configService.get<number>("auth.email.saltLength"),
			},
			[ENUM_EMAIL.SIGN_UP]: {
				signUp: this.configService.get<number>("auth.email.signUp"),
				saltLength: this.configService.get<number>("auth.signUp.saltLength"),
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
					message: "Invalid token payload",
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

	createSalt(length: number): string {
		return this.helperHashService.randomSalt(length);
	}

	/**
	 * 해시 정보 생성
	 * @param type
	 * @param text
	 * @returns
	 */
	createHashInfo(type: ENUM_EMAIL, text: string): IAuthHash {
		const salt: string = this.createSalt(this.hashInfo[type].saltLength);
		const expired: Date = this.helperDateService.forwardInSeconds(this.hashInfo[type].expiredIn);

		const created: Date = this.helperDateService.create();
		const hash = this.helperHashService.bcrypt(text, salt);

		return {
			hash,
			expired,
			hashCreated: created,
			salt,
		};
	}

	/**
	 * 사용자 이메일로 확인 후 로그인 또는 회원가입 처리
	 * @param tokenPayload 구글 인증 정보
	 * @returns 액세스 토큰, 리프레시 토큰, 사용자 정보
	 */
	async loginOrSignUp(tokenPayload: AuthenticatedRequest["user"]): Promise<AuthLoginResponse> {
		try {
			let user;
			// 사용자 조회
			user = await this.userService.findByEmail(tokenPayload.email);

			// 새 사용자라면 회원가입 처리
			if (!user) {
				user = await this.userService.socialJoin({
					email: tokenPayload.email,
				});
			}

			// 토큰 생성
			const payload = {
				email: tokenPayload.email,
				id: user.id,
			};

			const { accessToken, refreshToken } = this.createToken(payload);

			return {
				userId: user.id,
				accessToken,
				refreshToken,
				email: user.email,
				phoneNumber: user.phoneNumber,
			};
		} catch (e: any) {
			if (e?.response) {
				throw new BadRequestException(e.response);
			}
			throw new BadRequestException({
				...AUTH_LOGIN_OR_SIGNUP_ERROR,
				message: e.message,
			});
		}
	}

	/**
	 * 비밀번호 검증
	 * @param password 원본 비밀번호
	 * @param hashedPassword 해시된 비밀번호
	 * @returns 일치 여부
	 */
	validatePassword(password: string, hashedPassword: string): boolean {
		return this.helperHashService.comparePassword(password, hashedPassword);
	}

	/**
	 * 비밀번호 변경
	 * @param userId 사용자 ID
	 * @param currentPassword 현재 비밀번호
	 * @param newPassword 새 비밀번호
	 * @returns 성공 여부
	 */
	async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<boolean> {
		// 사용자 조회
		const user = await this.userService.findById(userId);
		if (!user || !user.password) {
			throw new BadRequestException("사용자를 찾을 수 없습니다.");
		}

		// 현재 비밀번호 검증
		const isCurrentPasswordValid = this.validatePassword(currentPassword, user.password);
		if (!isCurrentPasswordValid) {
			throw new BadRequestException("현재 비밀번호가 올바르지 않습니다.");
		}

		// 새 비밀번호 해시화
		const hashedNewPassword = this.helperHashService.hashPassword(newPassword);

		// 비밀번호 업데이트
		await this.userService.updatePassword(userId, hashedNewPassword);

		return true;
	}

	/**
	 * 비밀번호 재설정 (이메일 인증 후)
	 * @param email 이메일
	 * @param salt 인증 토큰
	 * @param newPassword 새 비밀번호
	 * @returns 성공 여부
	 */
	async resetPassword(email: string, salt: string, newPassword: string): Promise<boolean> {
		// 사용자 조회
		const user = await this.userService.findByEmail(email);
		if (!user) {
			throw new BadRequestException("사용자를 찾을 수 없습니다.");
		}

		// TODO: salt 검증 로직 추가 (실제 구현에서는 Redis나 DB에서 salt 검증)
		// 현재는 간단히 salt가 있는지만 확인
		if (!salt) {
			throw new BadRequestException("유효하지 않은 인증 토큰입니다.");
		}

		// 새 비밀번호 해시화
		const hashedNewPassword = this.helperHashService.hashPassword(newPassword);

		// 비밀번호 업데이트
		await this.userService.updatePassword(Number(user.id), hashedNewPassword);

		return true;
	}

	createToken(payload: { email: string; id: number }) {
		const accessToken = this.helperEncryptionService.jwtEncrypt(payload, {
			secretKey: this.configService.get("auth.jwt.accessToken.secretKey"),
			expiredIn: this.configService.get("auth.jwt.accessToken.expirationTime"),
			audience: this.configService.get("auth.jwt.audience"),
			issuer: this.configService.get("auth.jwt.issuer"),
			subject: this.configService.get("auth.jwt.subject"),
		});

		const refreshToken = this.helperEncryptionService.jwtEncrypt(payload, {
			secretKey: this.configService.get("auth.jwt.refreshToken.secretKey"),
			expiredIn: this.configService.get("auth.jwt.refreshToken.expirationTime"),
			audience: this.configService.get("auth.jwt.audience"),
			issuer: this.configService.get("auth.jwt.issuer"),
			subject: this.configService.get("auth.jwt.subject"),
		});

		return { accessToken, refreshToken };
	}
}
