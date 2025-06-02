"use client";

import { useState, useEffect } from "react";
import { HBCLoginMain } from "@/assets/svgs";
import { Button } from "@/components/ui/Button";
import { AuthFindIdModal } from "./Modal/AuthFindIdModal";
import { useFindEmailMutation } from "@/apis/auth/mutations";

export const AuthFindIdPassword = () => {
	const [isIdModalOpen, setIsIdModalOpen] = useState(false);
	const [name, setName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [email, setEmail] = useState<string>("");

	const { mutate: findEmail, isSuccess, isError, error, data } = useFindEmailMutation();

	const onFindId = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		findEmail({ name, phoneNumber });
	};

	useEffect(() => {
		if (isSuccess && data?.data.email) {
			setEmail(data.data.email);
			setIsIdModalOpen(true);
		}
		if (isError) {
			alert("이메일 찾기에 실패했습니다. 다시 시도해주세요.");
		}
	}, [isSuccess, data, isError, error]);

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

				<div className="mb-5 text-xl font-bold tracking-[0.22px]">이메일 찾기</div>

				<form onSubmit={onFindId}>
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
							value={name}
							onChange={(e) => setName(e.target.value)}
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
							value={phoneNumber}
							onChange={(e) => setPhoneNumber(e.target.value)}
						/>
					</div>
					<div className="flex justify-center">
						<Button
							size={"lg"}
							className="w-[225px] p-2.5 font-extrabold"
						>
							이메일 찾기
						</Button>
					</div>
				</form>

				{/* divider */}
				<div className="w-full h-[1px] bg-hbc-black my-17.5"></div>

				<div className="mb-5 text-xl font-bold tracking-[0.22px]">비밀번호 찾기</div>

				<form action="">
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
							size={"lg"}
							className="w-[225px] p-2.5 font-extrabold"
						>
							링크 전송
						</Button>
					</div>
				</form>
			</div>

			<AuthFindIdModal
				isOpen={isIdModalOpen}
				onCloseModal={onCloseModal}
				email={email}
			/>
		</>
	);
};
