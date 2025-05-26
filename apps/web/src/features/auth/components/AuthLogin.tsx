"use client";

import { GoogleLogin, HBCLoginMain, KaKaoTalkLogin, NaverLogin } from "@/assets/svgs";
import { cn } from "@/common/utils";
import { Button } from "@/components/ui/Button";
import { useGoogleAuth } from "@/hooks/use-google-auth";
import { useSignInWithEmail } from "@/apis/auth/mutations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLoginPayloadSchema } from "@hitbeatclub/shared-types/auth";
import { z } from "zod";
import Link from "next/link";
import { useState } from "react";

type FormData = z.infer<typeof AuthLoginPayloadSchema>;

export const AuthLogin = () => {
	const { handleGoogleLogin, isReady: isGoogleReady } = useGoogleAuth();
	const [loginError, setLoginError] = useState<string>("");

	const signInMutation = useSignInWithEmail({
		onError: (error) => {
			console.error("Login error:", error);
			setLoginError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
		},
		onSuccess: () => {
			setLoginError("");
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		resolver: zodResolver(AuthLoginPayloadSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = (data: FormData) => {
		setLoginError("");
		signInMutation.mutate(data);
	};

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
				onSubmit={handleSubmit(onSubmit)}
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
							{...register("email")}
							id="email"
							type="email"
							className={cn(
								"w-full px-3 py-2 border rounded-md border-hbc-black focus:outline-none",
								errors.email && "border-red-500",
							)}
						/>
						{errors.email && <div className="text-red-500 text-sm mt-1">{errors.email.message}</div>}
					</div>

					<div>
						<label
							htmlFor="password"
							className="relative"
						>
							비밀번호 <span className="absolute text-red-500 -top-2 -right-2">*</span>
						</label>
						<input
							{...register("password")}
							id="password"
							type="password"
							className={cn(
								"w-full px-3 py-2 border rounded-md border-hbc-black focus:outline-none",
								errors.password && "border-red-500",
							)}
						/>
						{errors.password && <div className="text-red-500 text-sm mt-1">{errors.password.message}</div>}
					</div>
				</div>

				{loginError && <div className="text-red-500 text-sm text-center">{loginError}</div>}

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
						disabled={isSubmitting || signInMutation.isPending}
						className="w-full h-[56px] py-2.5 text-2xl font-extrabold"
					>
						{signInMutation.isPending ? "로그인 중..." : "로그인"}
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

					<button
						type="button"
						className={cn(
							"flex items-center justify-center w-full h-10 gap-2 px-4 py-2 font-semibold bg-white border border-gray-300 rounded-md",
							isGoogleReady ? "cursor-pointer" : "cursor-not-allowed",
						)}
						onClick={handleGoogleLogin}
					>
						<GoogleLogin className="w-[24px] h-[24px]" />
						구글 로그인
					</button>
				</div>
			</form>
		</div>
	);
};
