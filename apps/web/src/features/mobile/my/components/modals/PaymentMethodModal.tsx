"use client";

import { Popup, PopupContent, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import { Paypal, Card } from "@/assets/svgs";
import { memo, useState, useEffect, useRef, useCallback } from "react";
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
import { type PaymentError, type PaymentResponse } from "@portone/browser-sdk/v2";
import { useExchangeRateLatestQueryOptions } from "@/apis/exchange-rate/query/exchange-rate.query-options";

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
		checkoutItems: _checkoutItems,
		onPaymentComplete,
		onPaymentError,
	}: PaymentMethodModalProps) => {
		const [isProcessing, setIsProcessing] = useState(false);

		const { mutateAsync: createPaymentOrder } = useCreatePaymentOrderMutation();
		const { mutateAsync: completePayment } = useCompletePaymentOrderMutation();

		const { data: userMe } = useQuery(getUserMeQueryOption());
		const { data: exchangeRateData } = useQuery(useExchangeRateLatestQueryOptions("KRW", "USD"));
		const krwToUsdRate = exchangeRateData?.rate ?? null;

		// PayPal SPB UI 관련 상태
		const [paypalUiStatus, setPaypalUiStatus] = useState<"idle" | "loading" | "rendered" | "error">("idle");
		const paypalInitializedRef = useRef(false);
		const paypalPaymentIdRef = useRef<string | null>(null);

		// 모달이 닫힐 때 selectedMethod를 초기화
		useEffect(() => {
			if (!isOpen) {
				setIsProcessing(false);

				paypalInitializedRef.current = false;
				setPaypalUiStatus("idle");

				const paypalContainer = document.getElementById("portone-paypal-ui-container");
				if (paypalContainer) paypalContainer.innerHTML = "";
			}
		}, [isOpen]);

		const handlePaymentMethodSelect = (method: "paypal" | "card") => {
			// 카드 결제의 경우 바로 모달을 닫고 결제 플로우를 진행합니다.
			if (method === "card") {
				onClose(false);
			}
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

		// PayPal SPB UI 초기화 핸들러
		const handlePaypalInit = useCallback(async () => {
			if (paypalInitializedRef.current) return;

			setPaypalUiStatus("loading");
			try {
				const paymentId = `payment-${uuidv4()}`;
				paypalPaymentIdRef.current = paymentId;

				// 1. 주문 생성 (통화: USD)
				const orderResponse = await createPaymentOrder({
					type: "CART",
					paymentId,
					currency: "USD",
				});

				// 2. PayPal Smart Payment Button UI 로드
				const usdAmount = krwToUsdRate ? Math.round(total * krwToUsdRate) : total;
				const usdScaleFactor = 10 ** 2;

				await PortOne.loadPaymentUI(
					{
						uiType: "PAYPAL_SPB",
						storeId: PORTONE_STORE_ID,
						channelKey: PORTONE_CHANNEL_KEY.PAYPAL,
						paymentId,
						orderName,
						totalAmount: usdAmount * usdScaleFactor,
						currency: PortOne.Entity.Currency.USD,
						customer: {
							fullName: userMe?.name,
							phoneNumber: userMe?.phoneNumber,
							email: userMe?.email,
							customerId: `hitbeatclub-${userMe?.id}`,
						},
					},
					{
						onPaymentSuccess: async (response: PaymentResponse) => {
							try {
								await completePayment({ paymentId });
								onPaymentComplete?.(orderResponse.data);
								onClose(false);
							} catch (e: any) {
								const msg = e instanceof AxiosError ? e.response?.data.detail : e?.message;
								onPaymentError?.({ message: msg || "PAYMENT_ERROR", code: "PAYMENT_ERROR" });
							}
						},
						onPaymentFail: (error: PaymentError) => {
							setPaypalUiStatus("error");
							paypalInitializedRef.current = false;

							// PayPal 컨테이너 정리
							const paypalContainer = document.getElementById("portone-paypal-ui-container");
							if (paypalContainer) paypalContainer.innerHTML = "";

							onPaymentError?.({ message: error.message, code: error.code || "PAYMENT_ERROR" });
						},
					},
				);

				paypalInitializedRef.current = true;
				setPaypalUiStatus("rendered");
			} catch (err: any) {
				setPaypalUiStatus("error");
				paypalInitializedRef.current = false;

				// PayPal 컨테이너 정리
				const paypalContainer = document.getElementById("portone-paypal-ui-container");
				if (paypalContainer) paypalContainer.innerHTML = "";

				const msg = err instanceof AxiosError ? err.response?.data?.detail : err?.message;
				onPaymentError?.({ message: msg || "PAYPAL_UI_ERROR", code: "PAYPAL_UI_ERROR" });
			}
		}, [
			createPaymentOrder,
			completePayment,
			krwToUsdRate,
			orderName,
			total,
			userMe,
			onPaymentComplete,
			onPaymentError,
			onClose,
		]);

		return (
			<Popup
				open={isOpen}
				onOpenChange={onClose}
				variant="mobile"
			>
				<PopupContent className="w-[calc(238px+42px)] flex flex-col bg-[#DADADA]">
					<PopupHeader>
						<PopupTitle className="text-[12px] leading-100% font-bold">어떻게 결제하시겠어요?</PopupTitle>
					</PopupHeader>
					<div className="flex flex-col gap-1 px-2 pb-2">
						{paypalUiStatus !== "loading" && paypalUiStatus !== "rendered" && (
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
						)}

						{/* 기존 PayPal 버튼 주석 처리 */}
						{/*
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
						*/}

						{/* PayPal Smart Payment Button UI */}
						{paypalUiStatus === "idle" && (
							<button
								onClick={handlePaypalInit}
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
						)}

						{paypalUiStatus === "loading" && (
							<div className="flex flex-col items-center justify-center w-full h-[120px] rounded-3px bg-gray-100 text-center">
								<svg
									className="w-6 h-6 mb-2 text-blue-500 animate-spin"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								<p className="text-[12px] font-semibold">PayPal 버튼을 준비 중입니다...</p>
							</div>
						)}

						{/* PayPal UI Container */}
						<div
							id="portone-paypal-ui-container"
							className="portone-ui-container mobile-cart-payment-select-modal flex justify-center w-full"
							style={{ display: paypalUiStatus === "rendered" ? "flex" : "none" }}
						></div>

						{paypalUiStatus === "rendered" && (
							<p className="mt-1 text-[11px] text-center font-medium text-black">
								PayPal 버튼을 눌러 결제를 진행해주세요.
							</p>
						)}

						{/* 환율 정보 */}
						{paypalUiStatus !== "idle" && (
							<p className="mt-2 text-[10px] text-center text-gray-500">
								{krwToUsdRate !== null
									? `1,000 KRW ≈ ${(1000 * krwToUsdRate).toFixed(4)} USD`
									: "환율 정보를 불러오는 중..."}
							</p>
						)}

						{paypalUiStatus === "error" && (
							<p className="mt-2 text-[12px] text-red-600 text-center">PayPal 버튼 로드 중 오류가 발생했습니다.</p>
						)}
					</div>
				</PopupContent>
			</Popup>
		);
	},
);

PaymentMethodModal.displayName = "PaymentMethodModal";
