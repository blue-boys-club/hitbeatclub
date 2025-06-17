"use client";

import { useCallback, useEffect, useState } from "react";
import * as PortOne from "@portone/browser-sdk/v2";
import * as Popup from "@/components/ui/Popup";
import { cn } from "@/common/utils";
import { type PaymentError, type PaymentResponse } from "@portone/browser-sdk/v2";
import { PORTONE_STORE_ID } from "@/lib/payment.constant";
import { PORTONE_CHANNEL_KEY } from "@/lib/payment.constant";
import type { PaymentOrderResponse } from "@hitbeatclub/shared-types/payment";
import { useCreatePaymentOrderMutation } from "@/apis/payment/mutations/useCreatePaymentOrderMutation";
import { useCompletePaymentOrderMutation } from "@/apis/payment/mutations/useCompletePaymentOrderMutation";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";

export type CheckoutItem = {
	id: number; // cart item ID (not product ID)
	imageUrl: string;
	title: string;
	price: number;
};

/**
 * 결제 수단 선택 모달 컴포넌트 Props
 */
interface PaymentSelectModalProps {
	/** 모달을 열기 위한 트리거 요소 */
	trigger?: React.ReactNode;
	/** 총 결제 금액 */
	total: number;
	/** 주문명 */
	orderName: string;
	/** 체크아웃 아이템 목록 */
	checkoutItems: CheckoutItem[];
	/** 모달 열림 상태 (제어 컴포넌트로 사용 시) */
	open?: boolean;
	/** 모달 열림/닫힘 상태 변경 콜백 */
	onOpenChange?: (open: boolean) => void;
	/** 결제 완료 콜백 */
	onPaymentComplete?: (result: PaymentOrderResponse) => void;
	/** 결제 실패 콜백 */
	onPaymentError?: (error: { message: string; code: string }) => void;
}

type PaymentMethod = {
	id: string;
	name: string;
	method: string;
	icon: string | React.ReactNode;
};

type EasyPayProvider = {
	id: string;
	name: string;
	bgColor: string;
	icon: string;
	availablePayMethods?: string[];
	checkIsAvailable?: () => boolean;
};

const paymentMethods: PaymentMethod[] = [
	{
		id: "card",
		name: "신용/체크카드",
		method: "CARD",
		icon: "💳",
	},
	// {
	// 	id: "virtual-account",
	// 	name: "가상계좌",
	// 	method: "VIRTUAL_ACCOUNT",
	// 	icon: "🏦",
	// },
	{
		id: "transfer",
		name: "계좌이체",
		method: "TRANSFER",
		icon: "💸",
	},
	// {
	// 	id: "mobile",
	// 	name: "휴대폰 소액결제",
	// 	method: "MOBILE",
	// 	icon: "📱",
	// },
	// {
	// 	id: "gift-certificate",
	// 	name: "상품권 결제",
	// 	method: "GIFT_CERTIFICATE",
	// 	icon: "🎁",
	// },
	{
		id: "paypal",
		name: "페이팔",
		method: "PAYPAL",
		icon: "💳",
	},
];

/**
 * 결제 수단 선택 및 결제 요청을 처리하는 모달 컴포넌트입니다.
 *
 * @param trigger 모달을 열기 위한 트리거 요소
 * @param total 총 결제 금액
 * @param orderName 주문명
 * @param checkoutItems 체크아웃 아이템 목록
 * @param open 모달 열림 상태 (제어 컴포넌트로 사용 시)
 * @param onOpenChange 모달 열림/닫힘 상태 변경 콜백
 * @param onPaymentComplete 결제 완료 콜백
 * @param onPaymentError 결제 실패 콜백
 */
export const PaymentSelectModal = ({
	trigger,
	total,
	orderName,
	checkoutItems,
	open = false,
	onOpenChange,
	onPaymentComplete,
	onPaymentError,
}: PaymentSelectModalProps) => {
	const [isOpen, setIsOpen] = useState(open);
	const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
	const [selectedEasyPayProvider, setSelectedEasyPayProvider] = useState<EasyPayProvider | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);

	const { mutateAsync: createPaymentOrder } = useCreatePaymentOrderMutation();
	const { mutateAsync: completePayment } = useCompletePaymentOrderMutation();
	useEffect(() => {
		setIsOpen(open);
	}, [open]);

	const onHandleOpenChange = useCallback(
		(open: boolean) => {
			console.log("open", open);
			setIsOpen(open);
			onOpenChange?.(open);
		},
		[onOpenChange],
	);

	const { data: userMe } = useQuery(getUserMeQueryOption());

	/**
	 * 결제 요청을 처리합니다.
	 * 1. 백엔드에 주문 생성 요청
	 * 2. 포트원 결제 요청
	 * 3. 백엔드에 결제 완료 처리 요청
	 */
	const handlePaymentRequest = useCallback(async () => {
		if (!selectedMethod) {
			alert("결제 수단을 선택해주세요.");
			return;
		}

		setIsProcessing(true);

		try {
			// 1. 백엔드에 주문 생성 요청
			const paymentId = `payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
			const cartItemIds = checkoutItems.map((item) => item.id);

			console.log("Creating payment order:", { paymentId, cartItemIds });

			const orderResponse = await createPaymentOrder({
				paymentId,
				cartItemIds,
			});

			console.log("Order created:", orderResponse);

			// 2. 포트원 결제 요청
			const paymentResponse = await PortOne.requestPayment({
				storeId: PORTONE_STORE_ID,
				channelKey: PORTONE_CHANNEL_KEY.PAYMENT,
				paymentId: paymentId,
				orderName: orderName,
				totalAmount: total,
				currency: PortOne.Entity.Currency.KRW,
				payMethod:
					selectedMethod.method === "CARD"
						? "CARD"
						: selectedMethod.method === "TRANSFER"
							? "TRANSFER"
							: selectedMethod.method === "PAYPAL"
								? "PAYPAL"
								: "CARD",
				customer: {
					fullName: userMe?.name,
					phoneNumber: userMe?.phoneNumber,
					email: userMe?.email,
					customerId: `hitbeatclub-${userMe?.id}`,
				},
				redirectUrl: `${window.location.origin}/payment/complete`,
				noticeUrls: [`${process.env.NEXT_PUBLIC_API_URL}/payment/webhook`],
			});

			console.log("Payment response:", paymentResponse);

			if (paymentResponse?.code && paymentResponse.code.startsWith("FAILURE")) {
				// 결제 실패
				throw new Error(paymentResponse.message || "결제가 실패했습니다.");
			}

			// 3. 백엔드에 결제 완료 처리 요청
			console.log("Completing payment:", { paymentId });

			const completionResponse = await completePayment({
				paymentId,
			});

			console.log("Payment completed:", completionResponse);

			// 성공 콜백 호출
			onPaymentComplete?.(orderResponse);
		} catch (error) {
			console.error("Payment error:", error);

			const errorMessage =
				error instanceof AxiosError
					? error.response?.data.detail
					: error instanceof Error
						? error.message
						: "결제 중 오류가 발생했습니다.";

			onPaymentError?.({
				message: errorMessage,
				code: "PAYMENT_ERROR",
			});
		} finally {
			setIsProcessing(false);
		}
	}, [selectedMethod, checkoutItems, orderName, total, onPaymentComplete, onPaymentError]);

	const handleMethodSelect = useCallback((method: PaymentMethod) => {
		setSelectedMethod(method);
	}, []);

	const resetPaymentState = useCallback(() => {
		setSelectedMethod(null);
		setSelectedEasyPayProvider(null);
	}, []);

	return (
		<Popup.Popup
			open={isOpen}
			onOpenChange={onHandleOpenChange}
		>
			{trigger && <Popup.PopupTrigger asChild>{trigger}</Popup.PopupTrigger>}
			<Popup.PopupContent className="w-[520px] max-h-[90vh]">
				<div className="max-h-[90vh] overflow-y-auto">
					<Popup.PopupHeader>
						<Popup.PopupTitle className="font-bold">결제 수단 선택</Popup.PopupTitle>
						<Popup.PopupDescription>
							{`결제하실 총 금액은 ${total.toLocaleString()}원입니다.\n결제 수단을 선택해주세요.`}
						</Popup.PopupDescription>
					</Popup.PopupHeader>

					<div
						className={cn(
							"grid gap-3 mt-4",
							paymentMethods.length > 4 || paymentMethods.length === 3 ? "grid-cols-3" : "grid-cols-2",
						)}
					>
						{paymentMethods.map((method) => (
							<button
								key={method.id}
								className={cn(
									"flex flex-col items-center justify-center p-4 border-2 rounded-[5px] cursor-pointer transition-all h-[100px]",
									selectedMethod?.id === method.id
										? "border-black bg-gray-100"
										: "border-gray-300 hover:border-gray-500",
								)}
								onClick={() => handleMethodSelect(method)}
							>
								<span className="mb-2 text-3xl">{method.icon}</span>
								<span className="font-bold text-[14px] font-suisse text-center">{method.name}</span>
							</button>
						))}
					</div>

					<Popup.PopupFooter className="mt-6">
						<Popup.PopupButton
							className="text-black bg-white border-2 border-black"
							onClick={() => onHandleOpenChange(false)}
						>
							취소
						</Popup.PopupButton>
						<Popup.PopupButton
							onClick={handlePaymentRequest}
							disabled={
								!selectedMethod || (selectedMethod.method === "EASY_PAY" && !selectedEasyPayProvider) || isProcessing
							}
							className={cn(
								(!selectedMethod ||
									(selectedMethod.method === "EASY_PAY" && !selectedEasyPayProvider) ||
									isProcessing) &&
									"opacity-50 cursor-not-allowed",
							)}
						>
							{isProcessing ? "결제 처리 중..." : "결제하기"}
						</Popup.PopupButton>
					</Popup.PopupFooter>
				</div>
			</Popup.PopupContent>
		</Popup.Popup>
	);
};
