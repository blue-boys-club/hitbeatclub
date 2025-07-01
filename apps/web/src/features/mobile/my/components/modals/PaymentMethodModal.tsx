"use client";

import { Popup, PopupContent, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import { Paypal, Search } from "@/assets/svgs";
import { Card } from "@/assets/svgs";
import { memo, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import * as PortOne from "@portone/browser-sdk/v2";
import { PORTONE_STORE_ID, PORTONE_CHANNEL_KEY } from "@/lib/payment.constant";
import { useCreatePaymentOrderMutation } from "@/apis/payment/mutations/useCreatePaymentOrderMutation";
import { useCompletePaymentOrderMutation } from "@/apis/payment/mutations/useCompletePaymentOrderMutation";
import { useQuery } from "@tanstack/react-query";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { AxiosError } from "axios";
import type { CheckoutItem } from "@/features/cart/components/modal/PaymentSelectModal";
import type { PaymentOrderResponse } from "@hitbeatclub/shared-types/payment";

interface PaymentMethodModalProps {
	isOpen: boolean;
	onClose: (open: boolean) => void;
	/** 총 결제 금액 (KRW) */
	total: number;
	/** 주문명 (예: "track 외 2개") */
	orderName: string;
	/** 체크아웃 아이템 목록 */
	checkoutItems: CheckoutItem[];
	/** 결제 완료 콜백 */
	onPaymentComplete?: (result: PaymentOrderResponse) => void;
	/** 결제 실패 콜백 */
	onPaymentError?: (error: { message: string; code: string }) => void;
}

export const PaymentMethodModal = memo(
	({
		isOpen,
		onClose,
		total,
		orderName,
		checkoutItems,
		onPaymentComplete,
		onPaymentError,
	}: PaymentMethodModalProps) => {
		const [isProcessing, setIsProcessing] = useState(false);

		const { mutateAsync: createPaymentOrder } = useCreatePaymentOrderMutation();
		const { mutateAsync: completePayment } = useCompletePaymentOrderMutation();

		const { data: userMe } = useQuery(getUserMeQueryOption());

		// 모달이 닫힐 때 selectedMethod를 초기화
		useEffect(() => {
			if (!isOpen) {
				setIsProcessing(false);
			}
		}, [isOpen]);

		const handlePaymentMethodSelect = (method: "paypal" | "card") => {
			void handlePaymentRequest(method);
		};

		// 실제 결제 요청 핸들러
		const handlePaymentRequest = async (method: "paypal" | "card") => {
			try {
				setIsProcessing(true);

				// 1. 주문 생성
				const paymentId = `payment-${uuidv4()}`;
				await createPaymentOrder({
					type: "CART",
					paymentId,
					// cartItemIds 생략 시 전체 카트
				});

				// 2. 포트원 결제 요청 (모바일은 리디렉션 방식 권장)
				await PortOne.requestPayment({
					storeId: PORTONE_STORE_ID,
					channelKey: PORTONE_CHANNEL_KEY.PAYMENT,
					paymentId,
					orderName,
					totalAmount: total,
					currency: PortOne.Entity.Currency.KRW,
					payMethod: method === "card" ? "CARD" : "PAYPAL",
					customer: {
						fullName: userMe?.name,
						phoneNumber: userMe?.phoneNumber,
						email: userMe?.email,
						customerId: `hitbeatclub-${userMe?.id}`,
					},
					redirectUrl: `${window.location.origin}/payment/complete`,
					noticeUrls: [`${process.env.NEXT_PUBLIC_API_URL}/payment/webhook`],
				});

				// 3. 결제 완료 처리 (redirect 완료 후 백엔드에서 webhook 처리될 수도 있음)
				await completePayment({ paymentId });

				onPaymentComplete?.({} as PaymentOrderResponse); // 임시, 실제 결과는 payment/complete 페이지에서 확인
				// 모달 닫기
				onClose(false);
			} catch (error: any) {
				const errMsg = error instanceof AxiosError ? error.response?.data?.detail : error?.message;
				onPaymentError?.({ message: errMsg || "PAYMENT_ERROR", code: "PAYMENT_ERROR" });
			} finally {
				setIsProcessing(false);
			}
		};

		return (
			<Popup
				open={isOpen}
				onOpenChange={onClose}
				variant="mobile"
			>
				<PopupContent className="w-[238px] flex flex-col bg-[#DADADA]">
					<PopupHeader>
						<PopupTitle className="text-[12px] leading-100% font-bold">어떻게 결제하시겠어요?</PopupTitle>
					</PopupHeader>
					<div className="flex flex-col gap-1 px-2 pb-2">
						<button
							onClick={() => handlePaymentMethodSelect("card")}
							className="flex items-center justify-center w-full h-33px gap-1 rounded-3px bg-black disabled:opacity-50"
							disabled={isProcessing}
						>
							{isProcessing ? (
								"Processing..."
							) : (
								<>
									<Card />
									<span className="font-semibold text-12px leading-100% text-white">Card</span>
								</>
							)}
						</button>
						<button
							onClick={() => handlePaymentMethodSelect("paypal")}
							className="flex items-center justify-center w-full h-33px gap-1 rounded-3px bg-black disabled:opacity-50"
							disabled={isProcessing}
						>
							{isProcessing ? (
								"Processing..."
							) : (
								<>
									<Paypal />
									<span className="font-semibold text-12px leading-100% text-white">PayPal</span>
								</>
							)}
						</button>
					</div>
				</PopupContent>
			</Popup>
		);
	},
);

PaymentMethodModal.displayName = "PaymentMethodModal";
