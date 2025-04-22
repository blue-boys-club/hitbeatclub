import { PopupButton } from "@/components/ui";
import { Popup, PopupContent, PopupDescription, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import React from "react";

interface UserDeleteCompleteModalProps {
	isModalOpen: boolean;
	onClose: () => void;
}
const UserDeleteCompleteModal = ({ isModalOpen, onClose }: UserDeleteCompleteModalProps) => {
	return (
		<Popup
			open={isModalOpen}
			onOpenChange={onClose}
		>
			<PopupContent>
				<PopupHeader>
					<PopupTitle className="text-2xl font-extrabold tracking-[0.26px]">회원 탈퇴 완료</PopupTitle>
				</PopupHeader>
				<PopupDescription className="text-hbc-black text-center font-suit text-base font-bold leading-[160%] tracking-[-0.32px]">
					탈퇴가 완료되었습니다. <br />
					히트비트클럽을 이용해주셔서 감사합니다. <br />
					감사합니다 🙏
				</PopupDescription>
				<PopupFooter>
					<PopupButton
						onClick={onClose}
						className="bg-[#FF1900]"
					>
						🫡
					</PopupButton>
				</PopupFooter>
			</PopupContent>
		</Popup>
	);
};

export default UserDeleteCompleteModal;
