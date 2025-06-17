"use client";

import * as Popup from "@/components/ui/Popup";
import { useEffect } from "react";
import type { PaymentOrderResponse } from "@hitbeatclub/shared-types/payment";

interface PaymentSuccessModalProps {
	isOpen: boolean;
	onClose: () => void;
	paymentResult: PaymentOrderResponse;
}

export const PaymentSuccessModal = ({ isOpen, onClose, paymentResult }: PaymentSuccessModalProps) => {
	useEffect(() => {
		if (isOpen) {
			// 결제 성공 이후 필요한 작업을 여기서 수행할 수 있습니다.
			// 예: 주문 정보 저장, 영수증 생성 등
			// paymentResult 객체에 데이터가 있는지 확인
			console.log(paymentResult);
		}
	}, [isOpen, paymentResult]);

	return (
		<Popup.Popup
			open={isOpen}
			onOpenChange={onClose}
		>
			<Popup.PopupContent className="w-412px">
				<Popup.PopupHeader>
					<Popup.PopupTitle className="font-bold text-center">구매 완료</Popup.PopupTitle>
					<div className="text-center mb-4">
						<span className="text-sm text-gray-600">주문번호: </span>
						<span className="font-mono font-bold text-black">{paymentResult.orderNumber}</span>
					</div>
					<Popup.PopupDescription className="font-bold leading-normal text-left whitespace-pre-line font-suit text-12px text-hbc-gray-400 tracking-012px">
						🎉 구매가 완료되었습니다!
						<br /> 결제도 잘 되었고, 지금 바로 음원을 확인하실 수 있어요.
						<br /> [마이페이지 &gt; 주문목록]에서 언제든 다시 확인할 수 있어요.
						<br /> 좋은 작업 되시길 바랍니다! 🎶
					</Popup.PopupDescription>
					<Popup.PopupDescription className="font-normal leading-normal text-left whitespace-pre-line text-hbc-gray-400 text-12px tracking-012px font-suit">
						*구매한 파일에 문제가 있을 시<br />
						2주내 고객센터를 통해 문의 바랍니다
					</Popup.PopupDescription>
				</Popup.PopupHeader>

				<Popup.PopupFooter className="mt-6 flex justify-center">
					<Popup.PopupButton
						onClick={onClose}
						className=""
					>
						확인
					</Popup.PopupButton>
				</Popup.PopupFooter>
			</Popup.PopupContent>
		</Popup.Popup>
	);
};
