import { UseGuards, applyDecorators } from "@nestjs/common";
import { AuthSocialGoogleGuard } from "../guards/social/auth.social.google.guard";
import { AuthSocialKakaoGuard } from "../guards/social/auth.social.kakao.guard";
import { AuthSocialNaverGuard } from "../guards/social/auth.social.naver.guard";

export function AuthSocialGoogleProtected(): MethodDecorator {
	return applyDecorators(UseGuards(AuthSocialGoogleGuard));
}

export function AuthSocialKakaoProtected(): MethodDecorator {
	return applyDecorators(UseGuards(AuthSocialKakaoGuard));
}

export function AuthSocialNaverProtected(): MethodDecorator {
	return applyDecorators(UseGuards(AuthSocialNaverGuard));
}
