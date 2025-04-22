"use client";
import { Input } from "@/components/ui";
import { Popup, PopupButton, PopupContent, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import { ToastViewport } from "@/components/ui/Toast/toast";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";

interface UserChangePasswordModalProps {
	isModalOpen: boolean;
	onClose: () => void;
}
const UserChangePasswordModal = ({ isModalOpen, onClose }: UserChangePasswordModalProps) => {
	const { toast } = useToast();
	const [isValidPassword, setIsValidPassword] = useState(false);
	const changePassword = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		toast({ description: "비밀번호가 변경 되었습니다." });
		onClose();
	};
	return (
		<>
			<Popup
				open={isModalOpen}
				onOpenChange={onClose}
			>
				<PopupContent>
					<PopupHeader>
						<PopupTitle className="text-2xl font-extrabold tracking-[0.26px]">비밀번호 재설정</PopupTitle>
					</PopupHeader>
					<form className="flex flex-col gap-[10px]">
						<div className="flex flex-col gap-[5px]">
							<label className="text-[color:var(--HBC-Black,#000)] font-[SUIT] text-base font-semibold leading-[160%] tracking-[-0.32px]">
								현재 비밀번호
							</label>
							<Input />
						</div>
						<div className="flex flex-col gap-[5px]">
							<label className="text-[color:var(--HBC-Black,#000)] font-[SUIT] text-base font-semibold leading-[160%] tracking-[-0.32px]">
								변경할 비밀번호
							</label>
							<Input />
						</div>
						<div className="flex flex-col gap-[5px]">
							<label className="text-[color:var(--HBC-Black,#000)] font-[SUIT] text-base font-semibold leading-[160%] tracking-[-0.32px]">
								비밀번호 확인
							</label>
							<Input />
						</div>
						<div className="flex justify-end">
							{isValidPassword ? (
								<div className="text-[#001EFF] font-[SUIT] text-xs font-semibold leading-[150%] tracking-[0.12px]">
									사용 가능한 비밀번호입니다.
								</div>
							) : (
								<div className="text-[#FF1900] font-[SUIT] text-xs font-semibold leading-[150%] tracking-[0.12px]">
									사용 불가능한 비밀번호입니다.
								</div>
							)}
						</div>
					</form>
					<ToastViewport />
					<PopupFooter>
						<PopupButton onClick={changePassword}>비밀번호 재설정</PopupButton>
					</PopupFooter>
				</PopupContent>
			</Popup>
		</>
	);
};

export default UserChangePasswordModal;
