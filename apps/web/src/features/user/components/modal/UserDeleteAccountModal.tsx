"use client";
import { useDeleteUserMutation } from "@/apis/user/mutations";
import { cn } from "@/common/utils";
import { PopupButton } from "@/components/ui";
import { Popup, PopupContent, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import React, { useState } from "react";

interface UserDeleteAccountModalProps {
	isModalOpen: boolean;
	onClose: () => void;
	onOpen: () => void;
}
const UserDeleteAccountModal = ({ isModalOpen, onClose, onOpen }: UserDeleteAccountModalProps) => {
	const [isChecked, setIsChecked] = useState(false);
	const [checkStates, setCheckStates] = useState({
		profit: false,
		product: false,
		reregister: false,
	});
	const [deletedReason, setDeletedReason] = useState("");

	const deleteUserMutation = useDeleteUserMutation();

	const handleCheckChange = (key: keyof typeof checkStates) => (e: React.ChangeEvent<HTMLInputElement>) => {
		const newCheckStates = { ...checkStates, [key]: e.target.checked };
		setCheckStates(newCheckStates);
		setIsChecked(Object.values(newCheckStates).every((state) => state));
	};

	const handleDeleteReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setDeletedReason(e.target.value);
	};

	const deleteUserAccount = () => {
		try {
			deleteUserMutation.mutate(
				{ deletedReason },
				{
					onSuccess: () => {
						onClose();
						onOpen();
					},
				},
			);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Popup
			open={isModalOpen}
			onOpenChange={onClose}
		>
			<PopupContent>
				<PopupHeader>
					<PopupTitle className="text-2xl font-extrabold tracking-[0.26px]">회원 탈퇴 신청</PopupTitle>
				</PopupHeader>
				<div className="py-4">
					<p className="pb-5 text-black font-suit text-base font-bold leading-[160%] tracking-[-0.32px] border-b-1 border-black">
						😢 정말 탈퇴하시겠어요? <br />
						탈퇴하시면 보유한 정산 내역, 구매 이력, 판매 데이터, 업로드한 음원 정보가 모두 삭제되며,
						<br />
						이후 복구가 어렵습니다. <br />
						진행하시겠다면 하단의 체크 항목을 확인해주세요.
					</p>
					<div className="pb-6 flex flex-col gap-[10px] py-[10px] border-b-1 border-black">
						<label className="flex gap-3 items-center cursor-pointer">
							<input
								type="checkbox"
								checked={checkStates.profit}
								onChange={handleCheckChange("profit")}
							/>
							<span className="text-black font-suit text-base font-bold leading-[160%] tracking-[-0.32px]">
								정산되지 않은 수익이 없는 것을 확인했습니다.
							</span>
						</label>
						<label className="flex gap-3 items-center cursor-pointer">
							<input
								type="checkbox"
								checked={checkStates.product}
								onChange={handleCheckChange("product")}
							/>
							<span className="text-black font-suit text-base font-bold leading-[160%] tracking-[-0.32px]">
								판매 중인 상품은 더 이상 노출되지 않으며, 복구가 불가합니다.
							</span>
						</label>
						<label className="flex gap-3 items-center cursor-pointer">
							<input
								type="checkbox"
								checked={checkStates.reregister}
								onChange={handleCheckChange("reregister")}
							/>
							<span className="text-black font-suit text-base font-bold leading-[160%] tracking-[-0.32px]">
								탈퇴 후 동일 계정으로는 재가입이 불가할 수 있습니다.
							</span>
						</label>
					</div>
					<p className="pt-5 text-black font-suit text-base font-bold leading-[160%] tracking-[-0.32px]">
						더 나은 서비스를 위해 의견을 듣고 싶어요!
					</p>
					<div className="flex pt-6">
						<textarea
							className="w-full h-[100px] resize-none outline-none border-x-1 border-y-2 border-black rounded-md px-1"
							onChange={handleDeleteReasonChange}
						/>
					</div>
				</div>
				<PopupFooter>
					<PopupButton
						className={cn("bg-[#FF1900]", !isChecked && "opacity-50")}
						disabled={!isChecked}
						onClick={deleteUserAccount}
					>
						탈퇴 진행
					</PopupButton>
				</PopupFooter>
			</PopupContent>
		</Popup>
	);
};

export default UserDeleteAccountModal;
