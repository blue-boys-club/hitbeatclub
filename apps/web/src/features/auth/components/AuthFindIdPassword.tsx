"use client";

import { useState } from "react";
import { HBCLoginMain } from "@/assets/svgs";
import { Button } from "@/components/ui/Button";
import { AuthFindIdModal } from "./Modal/AuthFindIdModal";
import { useSendChangePasswordEmailMutation } from "@/apis/email/mutations/useSendChangePasswordEmailMutation";

export const AuthFindIdPassword = () => {
	const [isIdModalOpen, setIsIdModalOpen] = useState(false);
	const [email, setEmail] = useState("");

	const sendChangePasswordEmailMutation = useSendChangePasswordEmailMutation();

	const onSubmitFindId = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsIdModalOpen(true);
	};

	const onSubmitFindPassword = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!email.trim()) return;

		try {
			await sendChangePasswordEmailMutation.mutateAsync(email);
			// TODO: 성공 메시지 표시 또는 처리
			alert("비밀번호 변경 링크가 이메일로 전송되었습니다.");
		} catch (error) {
			// TODO: 에러 처리
			console.error("이메일 전송 실패:", error);
			alert("이메일 전송에 실패했습니다. 다시 시도해주세요.");
		}
	};

	const onCloseModal = () => {
		setIsIdModalOpen(false);
	};

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

				<form onSubmit={onSubmitFindId}>
					<div className="space-y-4 mb-9">
						<label
							htmlFor="name"
							className="font-semibold"
						>
							이름
						</label>
						<input
							id="name"
							name="name"
							type="text"
							required
							className="w-full px-3 py-2 border rounded-md border-hbc-black focus:outline-none"
						/>
						<label
							htmlFor="phone"
							className="font-semibold"
						>
							연락처
						</label>
						<input
							id="phone"
							name="phone"
							type="text"
							required
							className="w-full px-3 py-2 border rounded-md border-hbc-black focus:outline-none"
						/>
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
						<span className="text-sm font-semibold underline cursor-pointer text-hbc-gray-300">
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
			/>
		</>
	);
};
