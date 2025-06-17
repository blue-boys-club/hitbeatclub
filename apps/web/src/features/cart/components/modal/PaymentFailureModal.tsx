"use client";

import * as Popup from "@/components/ui/Popup";
import { cn } from "@/common/utils";

interface PaymentFailureModalProps {
	isOpen: boolean;
	onClose: () => void;
	error: {
		message: string;
		code: string;
	};
}

export const PaymentFailureModal = ({ isOpen, onClose, error }: PaymentFailureModalProps) => {
	const getErrorMessage = (error: { message: string; code: string }) => {
		if (!error) return "알 수 없는 오류가 발생했습니다.";
		if (typeof error === "string") return error;
		if (error.message) return error.message;

		return "결제 중 오류가 발생했습니다. 다시 시도해주세요.";
	};

	return (
		<Popup.Popup
			open={isOpen}
			onOpenChange={onClose}
		>
			<Popup.PopupContent className="w-[559px] max-w-[559px]">
				<Popup.PopupHeader>
					<Popup.PopupTitle className="font-bold">구매 실패</Popup.PopupTitle>
					<Popup.PopupDescription className="text-left whitespace-pre-line">
						😥 결제가 정상적으로 완료되지 않았어요.
						<br /> 네트워크 상태 또는 결제 정보에 문제가 있을 수 있습니다.
						<br /> 다시 시도해보시거나, 문제가 지속될 경우 고객센터로 문의해주세요.
						<br />
						<br /> 오류 내용: {getErrorMessage(error)}
					</Popup.PopupDescription>
				</Popup.PopupHeader>

				<Popup.PopupFooter>
					<Popup.PopupButton onClick={onClose}>확인</Popup.PopupButton>
				</Popup.PopupFooter>
			</Popup.PopupContent>
		</Popup.Popup>
	);
};
