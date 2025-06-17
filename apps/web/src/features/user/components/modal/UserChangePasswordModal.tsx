"use client";

import React, { useMemo } from "react";
import { useForm } from "react-hook-form";

import { useUpdateUserPasswordMutation } from "@/apis/user/mutations/useUpdateUserPasswordMutation";
import { Input } from "@/components/ui";
import { Popup, PopupButton, PopupContent, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import { ToastViewport } from "@/components/ui/Toast/toast";
import { useToast } from "@/hooks/use-toast";

interface UserChangePasswordModalProps {
	isModalOpen: boolean;
	onClose: () => void;
}

interface UserUpdatePasswordFormData {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

const UserChangePasswordModal = ({ isModalOpen, onClose }: UserChangePasswordModalProps) => {
	const { toast } = useToast();
	const updateUserPasswordMutation = useUpdateUserPasswordMutation();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
		reset: resetForm,
	} = useForm<UserUpdatePasswordFormData>({
		mode: "onChange",
	});

	const newPasswordValue = watch("newPassword");
	const confirmPasswordValue = watch("confirmPassword");

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
		if (value !== newPasswordValue) {
			return "비밀번호가 일치하지 않습니다.";
		}
		return true;
	};

	const isValidPassword = useMemo(() => {
		// 두 값이 모두 존재하고, 에러가 없으며, 값이 동일한 경우에만 true
		return !!(
			newPasswordValue &&
			confirmPasswordValue &&
			!errors.newPassword &&
			!errors.confirmPassword &&
			newPasswordValue === confirmPasswordValue
		);
	}, [newPasswordValue, confirmPasswordValue, errors.newPassword, errors.confirmPassword]);

	const shouldShowPasswordMessage = useMemo(() => {
		return !!(newPasswordValue && confirmPasswordValue);
	}, [newPasswordValue, confirmPasswordValue]);

	const onCloseModal = () => {
		resetForm();
		onClose();
	};

	const onSubmit = (data: UserUpdatePasswordFormData) => {
		updateUserPasswordMutation.mutate(
			{
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
				confirmPassword: data.confirmPassword,
			},
			{
				onSuccess: () => {
					toast({ description: "비밀번호가 변경 되었습니다.", duration: 3000 });
					resetForm();
					onClose();
				},
				onError: (error) => {
					console.error("Password update error:", error);
					toast({
						description: "비밀번호 변경에 실패했습니다.",
						variant: "destructive",
						duration: 3000,
					});
				},
			},
		);
	};

	const handleFormSubmit = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		handleSubmit(onSubmit)();
	};

	return (
		<>
			<Popup
				open={isModalOpen}
				onOpenChange={onCloseModal}
			>
				<PopupContent>
					<PopupHeader>
						<PopupTitle className="text-2xl font-extrabold tracking-[0.26px]">비밀번호 재설정</PopupTitle>
					</PopupHeader>
					<form
						className="flex flex-col gap-[10px]"
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className="flex flex-col gap-[5px]">
							<label className="text-[color:var(--HBC-Black,#000)] font-[SUIT] text-base font-semibold leading-[160%] tracking-[-0.32px]">
								현재 비밀번호
							</label>
							<Input
								{...register("currentPassword", {
									required: "현재 비밀번호를 입력해주세요.",
								})}
								id="currentPassword"
								type="password"
							/>
							{errors.currentPassword && (
								<div className="flex justify-end text-[#FF0000] text-[12px] font-semibold tracking-[0.12px]">
									{errors.currentPassword.message}
								</div>
							)}
						</div>
						<div className="flex flex-col gap-[5px]">
							<label className="text-[color:var(--HBC-Black,#000)] font-[SUIT] text-base font-semibold leading-[160%] tracking-[-0.32px]">
								변경할 비밀번호
							</label>
							<Input
								{...register("newPassword", {
									required: "새 비밀번호를 입력해주세요.",
									validate: validatePassword,
								})}
								id="newPassword"
								type="password"
							/>
							{errors.newPassword && (
								<div className="flex justify-end text-[#FF0000] text-[12px] font-semibold tracking-[0.12px]">
									{errors.newPassword.message}
								</div>
							)}
						</div>
						<div className="flex flex-col gap-[5px]">
							<label className="text-[color:var(--HBC-Black,#000)] font-[SUIT] text-base font-semibold leading-[160%] tracking-[-0.32px]">
								비밀번호 확인
							</label>
							<Input
								{...register("confirmPassword", {
									required: "비밀번호 확인을 입력해주세요.",
									validate: validatePasswordConfirm,
								})}
								id="confirmPassword"
								type="password"
							/>
							{errors.confirmPassword && (
								<div className="flex justify-end text-[#FF0000] text-[12px] font-semibold tracking-[0.12px]">
									{errors.confirmPassword.message}
								</div>
							)}
						</div>
						<div className="flex justify-end">
							{shouldShowPasswordMessage &&
								(isValidPassword ? (
									<div className="text-[#001EFF] font-[SUIT] text-xs font-semibold leading-[150%] tracking-[0.12px]">
										사용 가능한 비밀번호입니다.
									</div>
								) : (
									<div className="text-[#FF1900] font-[SUIT] text-xs font-semibold leading-[150%] tracking-[0.12px]">
										사용 불가능한 비밀번호입니다.
									</div>
								))}
						</div>
					</form>
					<ToastViewport />
					<PopupFooter>
						<PopupButton
							disabled={!isValidPassword || updateUserPasswordMutation.isPending}
							onClick={handleFormSubmit}
						>
							{updateUserPasswordMutation.isPending ? "변경 중..." : "비밀번호 재설정"}
						</PopupButton>
					</PopupFooter>
				</PopupContent>
			</Popup>
		</>
	);
};

export default UserChangePasswordModal;
