"use client";

import { useSignInWithGoogle } from "@/apis/auth/mutations";
import { cn } from "@/common/utils";
import UI from "@/components/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

const DEBUG = process.env.NODE_ENV === "development";

export const AuthCallbackHandlerPage = () => {
	const [authCompleted, setAuthCompleted] = useState(false);
	const [authSignUpCompleted, setAuthSignUpCompleted] = useState(false);
	const [authError, setAuthError] = useState<string | null>(null);
	const router = useRouter();
	const searchParams = useSearchParams();
	const loginAttempted = useRef(false);

	const { mutateAsync: signInWithGoogle } = useSignInWithGoogle();

	// URL에서 authType과 code를 가져옵니다
	const authType = searchParams.get("authType");
	const code = searchParams.get("code");

	const loginHandler = async (): Promise<void> => {
		if (loginAttempted.current) return;
		loginAttempted.current = true;

		try {
			switch (authType) {
				case "google": {
					if (!code) {
						throw new Error("No code found");
					}
					const response = await signInWithGoogle({ code });
					setAuthSignUpCompleted(!!response.data.name);
					setAuthCompleted(true);
					break;
				}
				default:
					throw new Error("Invalid auth type");
			}
		} catch (error) {
			setAuthError(error instanceof Error ? error.message : "Unknown error");
			if (process.env.NODE_ENV === "production") {
				router.replace("/auth/login");
			}
		}
	};

	useEffect(() => {
		void loginHandler();
	}, []);

	useEffect(() => {
		if (!authCompleted) {
			return;
		}

		if (authSignUpCompleted) {
			// TODO: 회원가입이 완료된 경우의 리다이렉트 처리
			router.replace("/");
		} else {
			// TODO: 로그인만 완료된 경우의 리다이렉트 처리
			router.replace("/");
		}
	}, [authCompleted, authSignUpCompleted, router]);

	return (
		<div className={cn("flex flex-col items-center justify-center min-h-screen")}>
			{!authError && (
				<>
					<svg
						aria-hidden="true"
						className="w-8 h-8 text-accent-blue01 animate-spin fill-accent-blue04"
						viewBox="0 0 100 101"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
							fill="currentColor"
						/>
						<path
							d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
							fill="currentFill"
						/>
					</svg>

					<UI.Heading2 className="mt-4">로그인 진행중 입니다...</UI.Heading2>
				</>
			)}
			{authError && (
				<>
					<UI.Heading2 className="mt-4">로그인 실패</UI.Heading2>
					<UI.Heading3 className="mt-4">{authError}</UI.Heading3>
				</>
			)}

			{DEBUG && (
				<div className="flex flex-col gap-2 max-w-[500px] mt-4">
					<UI.Heading3>DEBUG INFO</UI.Heading3>
					{[
						{ title: "authType", data: authType, key: "authType" },
						{ title: "code", data: code, key: "code" },
						{ title: "searchParams", data: Object.fromEntries(searchParams.entries()), key: "searchParams" },
					].map((item) => (
						<div
							key={item.key}
							className="flex flex-col gap-2"
						>
							<UI.Heading4>{item.title}:</UI.Heading4>
							<code className="text-lable max-w-[500px] text-left text-wrap overflow-auto max-h-[120px] whitespace-pre-wrap">
								{item.data !== undefined ? JSON.stringify(item.data, null, 2) : "undefined"}
							</code>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
