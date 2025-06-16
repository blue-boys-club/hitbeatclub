"use client";

import { useSignInWithEmail } from "@/apis/auth/mutations";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { HBCLoginMain } from "@/assets/svgs";
import { cn } from "@/common/utils";
import { Button } from "@/components/ui/Button";
import { AuthLoginButtonWrapper } from "@/features/auth/components/AuthLoginButtonWrapper";
import { MobileAuthLoginButtonWrapper } from "@/features/mobile/login/components";
import { AuthLoginPayloadSchema } from "@hitbeatclub/shared-types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormData = z.infer<typeof AuthLoginPayloadSchema>;

const MobileLoginPage = () => {
	const router = useRouter();
	const { data: userMe, isSuccess: isUserMeSuccess } = useQuery(getUserMeQueryOption());
	const [loginError, setLoginError] = useState<string>("");

	const signInMutation = useSignInWithEmail({
		onError: (error) => {
			console.error("Login error:", error);
			setLoginError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
		},
		onSuccess: () => {
			setLoginError("");
			// router.push("/");
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

	useEffect(() => {
		// logged in user
		if (isUserMeSuccess && userMe.email) {
			router.push("/mobile");
		}
	}, [isUserMeSuccess, userMe, router]);

	return (
		<div className="py-8 flex flex-col items-center">
			<HBCLoginMain
				width={239}
				height={89}
			/>
			<div className="mt-18px text-center font-extrabold text-12px leading-110%">
				WE SUPPORT INDEPENDANT ARTISTS
				<br />
				히트비트클럽은 모든 인디펜던트 아티스트들을 응원합니다.
			</div>
			<form
				className="mt-20 w-241px"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="flex flex-col">
					<div>
						<div className="flex items-center gap-2 h-36px border-b-4px border-black">
							<label
								htmlFor="id"
								className="text-18px leading-32px font-semibold text-hbc-gray-300"
							>
								ID
							</label>
							<input
								id="id"
								className="w-full h-full focus:outline-none"
							/>
						</div>
						{errors.email && <div className="text-red-500 text-sm mt-1">{errors.email.message}</div>}
					</div>
					<div className="mt-7">
						<div className="flex items-center gap-2 h-36px border-b-4px border-black">
							<label
								htmlFor="password"
								className="text-18px leading-32px font-semibold text-hbc-gray-300"
							>
								PW
							</label>
							<input
								id="password"
								className="w-full h-full focus:outline-none"
							/>
						</div>
						{errors.password && <div className="text-red-500 text-sm mt-1">{errors.password.message}</div>}
					</div>
					{loginError && <div className="text-red-500 text-sm text-center mt-4">{loginError}</div>}
				</div>
				<div className="mt-12 mb-2.5 flex flex-col gap-4">
					<div className="flex flex-col gap-8px">
						<div className="flex justify-end space-x-2 text-md font-semibold tracking-[-0.32px]">
							<Link
								href="/auth/forgot"
								className="text-hbc-gray-300 font-semibold leading-160% text-12px"
							>
								아이디 / 비밀번호 찾기
							</Link>
							<Link
								href="/auth/signup"
								className="cursor-pointer text-hbc-blue font-semibold leading-160% text-12px"
							>
								회원가입
							</Link>
						</div>
						<button
							type="submit"
							disabled={isSubmitting || signInMutation.isPending}
							className="w-full h-7 text-12px leading-100% font-extrabold text-white bg-black rounded-5px"
						>
							{signInMutation.isPending ? "로그인 중..." : "로그인"}
						</button>
					</div>
					<div className="font-semibold text-12px leading-160% text-hbc-gray-300 text-center">또는</div>
					<MobileAuthLoginButtonWrapper />
				</div>
			</form>
		</div>
	);
};

export default MobileLoginPage;
