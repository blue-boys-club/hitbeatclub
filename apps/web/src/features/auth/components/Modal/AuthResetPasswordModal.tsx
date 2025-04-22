import { Popup, PopupContent, PopupDescription, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import { PopupButton } from "@/components/ui/PopupButton";
import { useState } from "react";

interface AuthResetPasswordModalProps {
	isOpen: boolean;
	onReset: () => void;
}

export const AuthResetPasswordModal = ({ isOpen, onReset }: AuthResetPasswordModalProps) => {
	const [password, setPassword] = useState("");
	const [isValid, setIsValid] = useState(false);

	const validatePassword = (password: string) => {
		// const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
		// return regex.test(password);
	};

	const onPasswordValid = (isValid: boolean) => {
		setIsValid(isValid);
	};

	return (
		<Popup open={isOpen}>
			<PopupContent>
				<PopupHeader>
					<PopupTitle className="text-2xl font-extrabold tracking-[0.26px]">비밀번호 재설정</PopupTitle>
				</PopupHeader>

				<PopupDescription>
					<label
						htmlFor="password"
						className="font-semibold"
					>
						변경할 비밀번호
					</label>
					<input
						id="password"
						type="password"
						className="w-full px-3 py-2 border border-hbc-black rounded-md focus:outline-none"
					/>
					<div
						className={`flex justify-end ${isValid ? "text-hbc-blue" : "text-[#FF0000]"} text-[12px] font-semibold tracking-[0.12px]`}
					>
						{isValid ? "사용 가능한 비밀번호입니다." : "사용할 수 없는 비밀번호입니다."}
					</div>

					<label
						htmlFor="passwordCheck"
						className="font-semibold"
					>
						비밀번호 확인
					</label>
					<input
						id="passwordCheck"
						type="password"
						className="w-full px-3 py-2 border border-hbc-black rounded-md focus:outline-none"
					/>
				</PopupDescription>

				<PopupFooter>
					<PopupButton
						onClick={onReset}
						className="py-2.5 font-bold"
					>
						비밀번호 재설정
					</PopupButton>
				</PopupFooter>
			</PopupContent>
		</Popup>
	);
};
