"use client";

import { GoogleLogin, KaKaoTalkLogin, NaverLogin } from "@/assets/svgs";
import { TempSpinner } from "@/assets/svgs/TempSpinner";
import { cn } from "@/common/utils";
import { useGoogleAuth } from "@/hooks/use-google-auth";
import { useEffect, useState } from "react";
import { generateKakaoOAuthURL, generateNaverOAuthURL } from "../auth.constants";

interface AuthLoginButtonWrapperProps {
	className?: string;
}

/**
 * 소셜 로그인 버튼들을 감싸는 클라이언트 사이드 전용 컴포넌트
 * OAuth URL을 동적으로 생성하여 SSR 문제를 해결합니다.
 */
export const AuthLoginButtonWrapper = ({ className }: AuthLoginButtonWrapperProps) => {
	const { handleGoogleLogin, isReady: isGoogleReady } = useGoogleAuth();
	const [kakaoUrl, setKakaoUrl] = useState<string>("");
	const [naverUrl, setNaverUrl] = useState<string>("");
	const [isOAuthUrlsReady, setIsOAuthUrlsReady] = useState<boolean>(false);

	useEffect(() => {
		// 클라이언트 사이드에서만 OAuth URL 생성
		try {
			const kakaoOAuthUrl = generateKakaoOAuthURL();
			const naverOAuthUrl = generateNaverOAuthURL();

			setKakaoUrl(kakaoOAuthUrl);
			setNaverUrl(naverOAuthUrl);
			setIsOAuthUrlsReady(true);
		} catch (error) {
			console.error("OAuth URL 생성 중 오류:", error);
		}
	}, []);

	const handleKakaoClick = (e: React.MouseEvent) => {
		if (!isOAuthUrlsReady || !kakaoUrl) {
			e.preventDefault();
		}
	};

	const handleNaverClick = (e: React.MouseEvent) => {
		if (!isOAuthUrlsReady || !naverUrl) {
			e.preventDefault();
		}
	};

	return (
		<div className={cn("space-y-3 w-[400px]", className)}>
			<a
				href={isOAuthUrlsReady ? kakaoUrl : "#"}
				onClick={handleKakaoClick}
				className={cn(
					"flex justify-center items-center gap-2 w-full h-10 py-2 px-4 rounded-md bg-[#FEE500] font-semibold",
					isOAuthUrlsReady ? "cursor-pointer" : "cursor-not-allowed opacity-50",
				)}
			>
				<KaKaoTalkLogin className={cn("w-[18px] h-[18px]", !isOAuthUrlsReady && "opacity-0")} />
				{!isOAuthUrlsReady && <TempSpinner className="w-[18px] h-[18px] text-gray-600 absolute" />}
				카카오 로그인
			</a>

			<a
				href={isOAuthUrlsReady ? naverUrl : "#"}
				onClick={handleNaverClick}
				className={cn(
					"flex justify-center items-center gap-2 w-full h-10 py-2 px-4 rounded-md bg-[#03C75A] text-white font-semibold",
					isOAuthUrlsReady ? "cursor-pointer" : "cursor-not-allowed opacity-50",
				)}
			>
				<NaverLogin className={cn("w-[18px] h-[18px]", !isOAuthUrlsReady && "opacity-0")} />
				{!isOAuthUrlsReady && <TempSpinner className="w-[18px] h-[18px] text-white absolute" />}
				네이버 로그인
			</a>

			<button
				type="button"
				className={cn(
					"flex items-center justify-center w-full h-10 gap-2 px-4 py-2 font-semibold bg-white border border-gray-300 rounded-md",
					isGoogleReady ? "cursor-pointer" : "cursor-not-allowed opacity-50",
				)}
				onClick={handleGoogleLogin}
				disabled={!isGoogleReady}
			>
				<GoogleLogin className="w-[24px] h-[24px]" />
				{isGoogleReady ? "구글 로그인" : "로딩 중..."}
			</button>
		</div>
	);
};
