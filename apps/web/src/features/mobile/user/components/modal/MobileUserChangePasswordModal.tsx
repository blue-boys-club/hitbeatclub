"use client";

import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { memo } from "react";

import { useUpdateUserPasswordMutation } from "@/apis/user/mutations/useUpdateUserPasswordMutation";
import { Popup, PopupContent, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import { useToast } from "@/hooks/use-toast";

interface MobileUserChangePasswordModalProps {
	isOpen: boolean;
	onClose: () => void;
}

interface UserUpdatePasswordFormData {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

export const MobileUserChangePasswordModal = memo(({ isOpen, onClose }: MobileUserChangePasswordModalProps) => {
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
		<Popup
			open={isOpen}
			onOpenChange={onCloseModal}
			variant="mobile"
		>
			<PopupContent className="w-[300px] flex flex-col bg-[#DADADA]">
				<PopupHeader>
					<PopupTitle className="text-[12px] leading-100% font-bold text-center">비밀번호 재설정</PopupTitle>
				</PopupHeader>
				<form
					className="flex flex-col gap-3"
					onSubmit={handleSubmit(onSubmit)}
				>
					<div className="flex flex-col gap-2px">
						<label className="font-bold text-10px leading-160%">현재 비밀번호</label>
						<input
							{...register("currentPassword", {
								required: "현재 비밀번호를 입력해주세요.",
							})}
							id="currentPassword"
							type="password"
							className="w-full h-25px rounded-3px placeholder:text-hbc-gray-300 text-11px leading-100% px-2 font-semibold focus:outline-none bg-white"
							placeholder="현재 비밀번호"
						/>
						{errors.currentPassword && (
							<div className="text-[#FF0000] text-8px font-semibold">{errors.currentPassword.message}</div>
						)}
					</div>

					<div className="flex flex-col gap-2px">
						<label className="font-bold text-10px leading-160%">변경할 비밀번호</label>
						<input
							{...register("newPassword", {
								required: "새 비밀번호를 입력해주세요.",
								validate: validatePassword,
							})}
							id="newPassword"
							type="password"
							className="w-full h-25px rounded-3px placeholder:text-hbc-gray-300 text-11px leading-100% px-2 font-semibold focus:outline-none bg-white"
							placeholder="영문, 숫자, 특수문자 8자 이상"
						/>
						{errors.newPassword && (
							<div className="text-[#FF0000] text-8px font-semibold">{errors.newPassword.message}</div>
						)}
					</div>

					<div className="flex flex-col gap-2px">
						<label className="font-bold text-10px leading-160%">비밀번호 확인</label>
						<input
							{...register("confirmPassword", {
								required: "비밀번호 확인을 입력해주세요.",
								validate: validatePasswordConfirm,
							})}
							id="confirmPassword"
							type="password"
							className="w-full h-25px rounded-3px placeholder:text-hbc-gray-300 text-11px leading-100% px-2 font-semibold focus:outline-none bg-white"
							placeholder="비밀번호 재입력"
						/>
						{errors.confirmPassword && (
							<div className="text-[#FF0000] text-8px font-semibold">{errors.confirmPassword.message}</div>
						)}
					</div>

					{shouldShowPasswordMessage && (
						<div className="flex justify-center">
							{isValidPassword ? (
								<div className="text-[#001EFF] text-8px font-semibold">사용 가능한 비밀번호입니다.</div>
							) : (
								<div className="text-[#FF1900] text-8px font-semibold">사용 불가능한 비밀번호입니다.</div>
							)}
						</div>
					)}

					<button
						type="button"
						disabled={!isValidPassword || updateUserPasswordMutation.isPending}
						onClick={handleFormSubmit}
						className="w-full bg-black rounded-30px h-25px text-white font-semibold text-10px leading-100% disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{updateUserPasswordMutation.isPending ? "변경 중..." : "비밀번호 재설정"}
					</button>
				</form>
			</PopupContent>
		</Popup>
	);
});

MobileUserChangePasswordModal.displayName = "MobileUserChangePasswordModal";
