"use client";

import {
	Popup,
	PopupContent,
	PopupDescription,
	PopupFooter,
	PopupHeader,
	PopupTitle,
	PopupButton,
} from "@/components/ui/Popup";
import { useForm } from "react-hook-form";
import { useResetPasswordMutation } from "@/apis/auth/mutations/useResetPasswordMutation";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface AuthResetPasswordModalProps {
	isOpen: boolean;
	onReset: () => void;
}

interface ResetPasswordFormData {
	password: string;
	passwordConfirm: string;
}

export const AuthResetPasswordModal = ({ isOpen, onReset }: AuthResetPasswordModalProps) => {
	const searchParams = useSearchParams();
	const email = searchParams.get("email") || "";
	const token = searchParams.get("token") || "";
	const { toast } = useToast();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isValid },
		reset: resetForm,
	} = useForm<ResetPasswordFormData>({
		mode: "onChange",
	});

	const resetPasswordMutation = useResetPasswordMutation();
	const password = watch("password");

	// 비밀번호 유효성 검사 함수
	const validatePassword = (value: string) => {
		const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
		if (!regex.test(value)) {
			return "영문, 숫자, 특수문자를 포함하여 8자 이상 입력해주세요.";
		}
		return true;
	};

	// 비밀번호 확인 검사 함수
	const validatePasswordConfirm = (value: string) => {
		if (value !== password) {
			return "비밀번호가 일치하지 않습니다.";
		}
		return true;
	};

	// 폼 제출 핸들러
	const onSubmit = async (data: ResetPasswordFormData) => {
		try {
			await resetPasswordMutation
				.mutateAsync({
					email,
					token,
					newPassword: data.password,
					confirmPassword: data.passwordConfirm,
				})
				.then(() => {
					toast({
						description: "비밀번호가 성공적으로 재설정되었습니다.",
					});
					// 성공 시 폼 리셋 및 모달 닫기
					resetForm();
					onReset();
				})
				.catch((error) => {
					if (error.response.data.message) {
						toast({
							description: error.response.data.message,
						});
					}
				});
		} catch (error) {
			console.error("비밀번호 재설정 실패:", error);
		}
	};

	// 모달이 닫힐 때 폼 리셋
	const handleModalClose = () => {
		resetForm();
		onReset();
	};

	// PopupButton 클릭 핸들러 (form submit 트리거)
	const handleButtonClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		handleSubmit(onSubmit)();
	};

	return (
		<Popup open={isOpen}>
			<PopupContent>
				<PopupHeader>
					<PopupTitle className="text-2xl font-extrabold tracking-[0.26px]">비밀번호 재설정</PopupTitle>
				</PopupHeader>

				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="space-y-4">
						<div>
							<label
								htmlFor="password"
								className="font-semibold"
							>
								변경할 비밀번호
							</label>
							<input
								{...register("password", {
									required: "비밀번호를 입력해주세요.",
									validate: validatePassword,
								})}
								id="password"
								type="password"
								className="w-full px-3 py-2 border border-hbc-black rounded-md focus:outline-none"
							/>
							<div
								className={`flex justify-end ${
									errors.password ? "text-[#FF0000]" : password && !errors.password ? "text-hbc-blue" : "text-[#FF0000]"
								} text-[12px] font-semibold tracking-[0.12px]`}
							>
								{errors.password
									? errors.password.message
									: password && !errors.password
										? "사용 가능한 비밀번호입니다."
										: "사용할 수 없는 비밀번호입니다."}
							</div>
						</div>

						<div>
							<label
								htmlFor="passwordConfirm"
								className="font-semibold"
							>
								비밀번호 확인
							</label>
							<input
								{...register("passwordConfirm", {
									required: "비밀번호 확인을 입력해주세요.",
									validate: validatePasswordConfirm,
								})}
								id="passwordConfirm"
								type="password"
								className="w-full px-3 py-2 border border-hbc-black rounded-md focus:outline-none"
							/>
							{errors.passwordConfirm && (
								<div className="flex justify-end text-[#FF0000] text-[12px] font-semibold tracking-[0.12px]">
									{errors.passwordConfirm.message}
								</div>
							)}
						</div>
					</div>

					<PopupFooter>
						<PopupButton
							onClick={handleButtonClick}
							disabled={!isValid || resetPasswordMutation.isPending}
							className="py-2.5 font-bold mt-4"
						>
							{resetPasswordMutation.isPending ? "재설정 중..." : "재설정"}
						</PopupButton>
					</PopupFooter>
				</form>
			</PopupContent>
		</Popup>
	);
};
