"use client";

import { GoogleLogin, HBCLoginMain, KaKaoTalkLogin, NaverLogin } from "@/assets/svgs";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useScript } from "usehooks-ts";

// Google OAuth 타입 정의
declare global {
	interface Window {
		google: {
			accounts: {
				id: {
					initialize: (config: {
						client_id: string;
						login_uri: string;
						ux_mode: string;
						use_fedcm_for_button: boolean;
						use_fedcm_for_prompt: boolean;
						button_auto_select: boolean;
						callback: (response: { credential?: string }) => void;
					}) => void;
					renderButton: (
						element: HTMLElement,
						options: {
							theme: string;
							size: string;
							text: string;
							type: string;
							width: string;
							click_listener?: () => void;
						},
					) => void;
				};
			};
		};
	}
}

export const AuthLogin = () => {
	const router = useRouter();
	const [googleButtonRef, setGoogleButtonRef] = useState<HTMLDivElement | null>(null);

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	const script = useScript("https://accounts.google.com/gsi/client", {
		removeOnUnmount: false,
	});

	useEffect(() => {
		if (typeof window.google !== "undefined" && googleButtonRef) {
			window.google.accounts.id.initialize({
				client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
				login_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || "",
				ux_mode: "popup",
				use_fedcm_for_button: false,
				use_fedcm_for_prompt: false,
				button_auto_select: true,

				callback: (response: { credential?: string }) => {
					if (response.credential) {
						router.push(`/auth/google/callback?credential=${encodeURIComponent(response.credential)}`);
					} else {
						console.error("Google 로그인 실패", response);
					}
				},
			});

			window.google.accounts.id.renderButton(googleButtonRef, {
				theme: "outline",
				size: "large",
				text: "continue_with",
				type: "standard",
				width: "414",
				click_listener: () => {
					console.log("click the google button");
				},
			});
		}
	}, [script, googleButtonRef, router]);

	return (
		<div className="w-[400px] h-full m-auto py-20 flex flex-col items-center justify-center">
			<div>
				<HBCLoginMain />
			</div>

			<div className="mt-4.5 text-center font-bold">
				WE SUPPORT INDEPENDANT ARTISTS
				<br />
				히트비트클럽은 모든 인디펜던트 아티스트들을 응원합니다.
			</div>

			<form
				className="mt-20 space-y-6"
				onSubmit={onSubmit}
			>
				<div className="space-y-4">
					<div>
						<label
							htmlFor="email"
							className="relative"
						>
							이메일 주소 <span className="absolute text-red-500 -top-2 -right-2">*</span>
						</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							className="w-full px-3 py-2 border rounded-md border-hbc-black focus:outline-none"
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="relative"
						>
							비밀번호 <span className="absolute text-red-500 -top-2 -right-2">*</span>
						</label>
						<input
							id="password"
							name="password"
							type="password"
							required
							className="w-full px-3 py-2 border rounded-md border-hbc-black focus:outline-none"
						/>
					</div>
				</div>

				<div>
					<div className="mt-12 mb-2.5 flex justify-end space-x-2.5 text-md font-semibold tracking-[-0.32px]">
						<Link
							href="/auth/forgot"
							className="text-gray-500 cursor-pointer"
						>
							아이디 / 비밀번호 찾기
						</Link>
						<Link
							href="/auth/signup"
							className="cursor-pointer text-hbc-blue"
						>
							회원가입
						</Link>
					</div>

					<Button
						type="submit"
						className="w-full h-[56px] py-2.5 text-2xl font-extrabold"
					>
						로그인
					</Button>
				</div>

				<div className="font-semibold text-center text-gray-500">또는</div>

				<div className="space-y-3 w-[400px]">
					<button
						type="button"
						className="flex justify-center items-center gap-2 w-full h-10 py-2 px-4 rounded-md bg-[#FEE500] font-semibold cursor-pointer"
					>
						<KaKaoTalkLogin className="w-[18px] h-[18px]" />
						카카오 로그인
					</button>

					<button
						type="button"
						className="flex justify-center items-center gap-2 w-full h-10 py-2 px-4 rounded-md bg-[#03C75A] text-white font-semibold cursor-pointer"
					>
						<NaverLogin className="w-[18px] h-[18px]" />
						네이버 로그인
					</button>

					<div className="absolute h-full w-full opacity-0">
						<div
							ref={setGoogleButtonRef}
							id="google-signin-button"
						/>
					</div>
					<button
						type="button"
						className="flex items-center justify-center w-full h-10 gap-2 px-4 py-2 font-semibold bg-white border border-gray-300 rounded-md cursor-pointer"
					>
						<GoogleLogin className="w-[24px] h-[24px]" />
						구글 로그인
					</button>
				</div>
			</form>
		</div>
	);
};
