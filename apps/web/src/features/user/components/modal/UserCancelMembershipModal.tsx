import React, { useCallback } from "react";
import { Popup, PopupContent, PopupFooter, PopupTitle } from "@/components/ui/Popup";
import { PopupButton } from "@/components/ui";
import { useRouter } from "next/navigation";
interface UserCancelMembershipModalProps {
	isModalOpen: boolean;
	onClose: () => void;
	userId: number;
}

const UserCancelMembershipModal = ({ isModalOpen, onClose, userId }: UserCancelMembershipModalProps) => {
	const router = useRouter();

	const handleCancelMembership = useCallback(() => {
		if (!userId) return;
		router.push(`/artist-studio/${userId}/setting?tab=membership`);
		onClose();
	}, [userId, onClose, router]);

	return (
		<Popup
			open={isModalOpen}
			onOpenChange={onClose}
		>
			<PopupContent>
				<PopupTitle className="text-black text-center font-[SUIT] text-[26px] font-bold leading-[32px] tracking-[0.26px]">
					현재 회원님은 멤버십에 가입되어 있습니다!
				</PopupTitle>
				<div className="flex flex-col justify-center px-4">
					<div className="text-black font-['Inter'] text-base font-bold leading-[160%] tracking-[-0.32px]">
						현재 멤버십에 가입되어 있어 회원 탈퇴를 진행할 수 없습니다.
						<br />
						먼저 멤버십을 해지해주세요 :)
					</div>
					<br />
					<div className="text-black font-[Inter] text-xs font-bold leading-[160%] tracking-[-0.24px]">
						[AtistStudio] &gt; [Atist Info] &gt;[히트비트 멤버십 정보] &gt;[멤버십 해지]
					</div>
				</div>
				<PopupFooter>
					<PopupButton
						onClick={handleCancelMembership}
						className="bg-[#FF1900]"
					>
						멤버십 해지하기
					</PopupButton>
				</PopupFooter>
			</PopupContent>
		</Popup>
	);
};

export default UserCancelMembershipModal;
