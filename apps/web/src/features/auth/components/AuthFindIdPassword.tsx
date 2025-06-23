"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HBCLoginMain } from "@/assets/svgs";
import { Button } from "@/components/ui/Button";
import { AuthFindIdModal } from "./Modal/AuthFindIdModal";
import { useFindEmailMutation } from "@/apis/auth/mutations";
import { useSendChangePasswordEmailMutation } from "@/apis/email/mutations/useSendChangePasswordEmailMutation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthFindIdPayload } from "@hitbeatclub/shared-types";
import { AxiosError } from "axios";
import { Toaster } from "@/components/ui/Toast/toaster";

export const AuthFindIdPassword = () => {
	const router = useRouter();
	const [isIdModalOpen, setIsIdModalOpen] = useState(false);
	const [name, setName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [email, setEmail] = useState("");
	const [foundEmail, setFoundEmail] = useState("");

	const { mutateAsync: findEmail } = useFindEmailMutation();
	const sendChangePasswordEmailMutation = useSendChangePasswordEmailMutation();

	const AuthFindIdPayloadSchema = z.object({
		name: z.string().min(1, "이름을 입력해주세요."),
		phoneNumber: z
			.string()
			.min(1, "휴대폰 번호를 입력해주세요.")
			.regex(/^01[0-9]{8,9}$/, "올바른 휴대폰 번호 형식을 입력해주세요. (예: 01012345678)"),
	});

	const onCloseModal = () => {
		setIsIdModalOpen(false);
	};

	const onSubmitFindId = async (data: AuthFindIdPayload) => {
		try {
			const response = await findEmail(data);
			const email = response.data.email;
			setFoundEmail(email);
			setIsIdModalOpen(true);
		} catch (error) {
			console.error("이메일 찾기 실패:", error);
			alert("이메일 찾기에 실패했습니다. 다시 시도해주세요.");
		}
	};

	const onSubmitFindPassword = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!email.trim()) return;

		try {
			await sendChangePasswordEmailMutation.mutateAsync(email);
			alert("비밀번호 변경 링크가 이메일로 전송되었습니다.");
		} catch (error) {
			if (error instanceof AxiosError && error.response?.status === 400) {
				alert(error.response?.data.message);
				return;
			}
			console.error("이메일 전송 실패:", error);
			alert("이메일 전송에 실패했습니다. 다시 시도해주세요.");
		}
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<AuthFindIdPayload>({
		resolver: zodResolver(AuthFindIdPayloadSchema),
		mode: "onChange",
	});

	return (
		<>
			<div className="w-[400px] h-full m-auto py-20">
				<div className="flex flex-col items-center justify-center">
					<div className="mb-9">
						<HBCLoginMain className="w-[240px] h-[89px]" />
					</div>

					<div className="text-2xl font-extrabold mb-9">아이디 / 비밀번호 찾기</div>
				</div>

				{/* 이메일 찾기 폼 */}
				<div className="mb-5 text-xl font-bold tracking-[0.22px]">이메일 찾기</div>

				<form onSubmit={handleSubmit(onSubmitFindId)}>
					<div className="space-y-4 mb-9">
						<div>
							<label
								htmlFor="name"
								className="font-semibold"
							>
								이름
							</label>
							<input
								{...register("name", { required: "이름을 입력해주세요." })}
								id="name"
								name="name"
								type="text"
								placeholder="이름"
								className="w-full px-3 py-2 border rounded-md border-hbc-black focus:outline-none"
								value={name}
								onChange={(e) => {
									setName(e.target.value);
									setValue("name", e.target.value, { shouldValidate: true });
								}}
							/>
							{errors.name && <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>}
						</div>

						<div>
							<label
								htmlFor="phoneNumber"
								className="font-semibold"
							>
								연락처
							</label>
							<input
								{...register("phoneNumber", { required: "휴대폰 번호를 입력해주세요." })}
								id="phoneNumber"
								name="phoneNumber"
								type="tel"
								placeholder="예) 01012345678"
								className="w-full px-3 py-2 border rounded-md border-hbc-black focus:outline-none"
								maxLength={11}
								value={phoneNumber}
								onChange={(e) => {
									// 숫자만 허용
									const value = e.target.value.replace(/[^0-9]/g, "");
									setPhoneNumber(value);
									setValue("phoneNumber", value, { shouldValidate: true });
								}}
							/>
							{errors.phoneNumber && <span className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</span>}
						</div>
					</div>

					<div className="flex justify-center">
						<Button
							type="submit"
							size={"lg"}
							className="w-[225px] p-2.5 font-extrabold"
						>
							이메일 찾기
						</Button>
					</div>
				</form>

				{/* divider */}
				<div className="w-full h-[1px] bg-hbc-black my-17.5"></div>

				{/* 비밀번호 찾기 폼 */}
				<div className="mb-5 text-xl font-bold tracking-[0.22px]">비밀번호 찾기</div>

				<form onSubmit={onSubmitFindPassword}>
					<div>
						<label
							htmlFor="email"
							className="font-semibold"
						>
							이메일
						</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-3 py-2 mb-2 border rounded-md border-hbc-black focus:outline-none"
						/>
					</div>

					<div className="flex justify-end mb-9">
						<span
							className="text-sm font-semibold underline cursor-pointer text-hbc-gray-300"
							onClick={() => router.push("/support")}
						>
							도움이 필요하신가요?
						</span>
					</div>

					<div className="flex justify-center">
						<Button
							type="submit"
							size={"lg"}
							className="w-[225px] p-2.5 font-extrabold"
							disabled={sendChangePasswordEmailMutation.isPending}
						>
							{sendChangePasswordEmailMutation.isPending ? "전송 중..." : "링크 전송"}
						</Button>
					</div>
				</form>
			</div>

			<AuthFindIdModal
				isOpen={isIdModalOpen}
				onCloseModal={onCloseModal}
				email={foundEmail}
			/>

			<Toaster />
		</>
	);
};
