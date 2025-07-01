"use client";

// import { randomUUID } from "crypto";
import { v4 as uuidv4 } from "uuid";
import { useCallback, useState, useRef, useEffect } from "react";
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
import { useExchangeRateLatestQueryOptions } from "@/apis/exchange-rate/query/exchange-rate.query-options";

export type CheckoutItem = {
	productId: number;
	licenseId: number;
	imageUrl: string;
	title: string;
	price: number;
};

/**
 * 결제 수단 선택 모달 컴포넌트 Props
 */
interface PaymentSelectModalProps {
	/** 총 결제 금액 */
	total: number;
	/** 주문명 */
	orderName: string;
	/** 체크아웃 아이템 목록 */
	checkoutItems: CheckoutItem[];
	/** 모달 열림 상태 */
	open: boolean;
	/** 모달 열림/닫힘 상태 변경 콜백 */
	onOpenChange: (open: boolean) => void;
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
 * @param total 총 결제 금액
 * @param orderName 주문명
 * @param checkoutItems 체크아웃 아이템 목록
 * @param open 모달 열림 상태
 * @param onOpenChange 모달 열림/닫힘 상태 변경 콜백
 * @param onPaymentComplete 결제 완료 콜백
 * @param onPaymentError 결제 실패 콜백
 */
export const PaymentSelectModal = ({
	total,
	orderName,
	checkoutItems,
	open,
	onOpenChange,
	onPaymentComplete,
	onPaymentError,
}: PaymentSelectModalProps) => {
	const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
	const [selectedEasyPayProvider, setSelectedEasyPayProvider] = useState<EasyPayProvider | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const [paypalUiStatus, setPaypalUiStatus] = useState<"idle" | "loading" | "rendered" | "error">("idle");
	const paypalInitializedRef = useRef(false);
	const paypalPaymentIdRef = useRef<string | null>(null);

	const { mutateAsync: createPaymentOrder } = useCreatePaymentOrderMutation();
	const { mutateAsync: completePayment } = useCompletePaymentOrderMutation();

	// 환율 (KRW→USD) – PayPal 결제 시 필요
	const { data: exchangeRateData } = useQuery(useExchangeRateLatestQueryOptions("KRW", "USD"));
	const krwToUsdRate = exchangeRateData?.rate ?? null;

	const onHandleOpenChange = useCallback(
		(openState: boolean) => {
			onOpenChange(openState);

			// 모달이 닫히면 PayPal UI 초기화 상태를 리셋합니다.
			if (!openState) {
				setSelectedMethod(null);
				paypalInitializedRef.current = false;
				setPaypalUiStatus("idle");

				// PayPal UI 컨테이너 정리
				const paypalContainer = document.getElementById("portone-paypal-ui-container");
				if (paypalContainer) {
					paypalContainer.innerHTML = "";
				}
			}
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
			// const paymentId = `payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
			const paymentId = `payment-${uuidv4()}`;

			console.log("Creating payment order:", { paymentId });

			const orderResponse = await createPaymentOrder({
				type: "CART",
				paymentId,
				currency: selectedMethod.method === "PAYPAL" ? "USD" : undefined,
				// cartItemIds 생략하면 전체 카트 아이템으로 결제
			});

			console.log("Order created:", orderResponse);

			const currency = selectedMethod.method === "PAYPAL" ? PortOne.Entity.Currency.USD : PortOne.Entity.Currency.KRW;
			const rate = selectedMethod.method === "PAYPAL" ? (krwToUsdRate ?? 1) : 1;
			const scaleFactor = selectedMethod.method === "PAYPAL" ? 10 ** 2 : 1;

			const paymentResponse = await PortOne.requestPayment({
				storeId: PORTONE_STORE_ID,
				channelKey: PORTONE_CHANNEL_KEY.PAYMENT,
				paymentId: paymentId,
				orderName: orderName,
				totalAmount: total * rate * scaleFactor,
				currency,
				payMethod:
					selectedMethod.method === "CARD"
						? "CARD"
						: selectedMethod.method === "TRANSFER"
							? "TRANSFER"
							: selectedMethod.method === "PAYPAL"
								? "PAYPAL"
								: "CARD",
				// products: checkoutItems.map((item) => ({
				// 	id: item.productId.toString(),
				// 	name: item.title,
				// 	amount: Math.round(item.price * rate * scaleFactor),
				// 	quantity: 1,
				// })),
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
			onPaymentComplete?.(orderResponse.data);
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
	}, [selectedMethod, checkoutItems, orderName, total, krwToUsdRate, onPaymentComplete, onPaymentError]);

	const handleMethodSelect = useCallback((method: PaymentMethod) => {
		setSelectedMethod(method);
	}, []);

	const resetPaymentState = useCallback(() => {
		setSelectedMethod(null);
		setSelectedEasyPayProvider(null);
	}, []);

	// Load PayPal Smart Payment Button UI when PayPal method selected
	useEffect(() => {
		const loadPaypalUI = async () => {
			if (paypalInitializedRef.current || selectedMethod?.method !== "PAYPAL") return;

			setPaypalUiStatus("loading");
			try {
				const paymentId = `payment-${uuidv4()}`;
				paypalPaymentIdRef.current = paymentId;

				// 1. Create order in backend (CART type)
				const orderResponse = await createPaymentOrder({
					type: "CART",
					paymentId,
					currency: "USD",
				});

				// 2. Render PayPal Smart Payment Button via PortOne SDK
				const usdAmount = krwToUsdRate ? Math.round(total * krwToUsdRate) : total;
				const rate = krwToUsdRate ?? 1;
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
						// products: checkoutItems.map((item) => ({
						// 	id: item.productId.toString(),
						// 	name: item.title,
						// 	amount: Math.round(item.price * rate * usdScaleFactor),
						// 	quantity: 1,
						// })),
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
								onHandleOpenChange(false);
							} catch (e: any) {
								const msg = e instanceof AxiosError ? e.response?.data.detail : e?.message;
								onPaymentError?.({ message: msg || "PAYMENT_ERROR", code: "PAYMENT_ERROR" });
							}
						},
						onPaymentFail: (error: PaymentError) => {
							setPaypalUiStatus("error");
							paypalInitializedRef.current = false;

							// 에러 발생 시 PayPal 컨테이너 정리
							const paypalErrorContainer = document.getElementById("portone-paypal-ui-container");
							if (paypalErrorContainer) {
								paypalErrorContainer.innerHTML = "";
							}

							onPaymentError?.({ message: error.message, code: error.code || "PAYMENT_ERROR" });
						},
					},
				);

				paypalInitializedRef.current = true;
				setPaypalUiStatus("rendered");
			} catch (err: any) {
				setPaypalUiStatus("error");
				paypalInitializedRef.current = false;

				// 에러 발생 시 PayPal 컨테이너 정리
				const paypalErrorContainer = document.getElementById("portone-paypal-ui-container");
				if (paypalErrorContainer) {
					paypalErrorContainer.innerHTML = "";
				}

				const msg = err instanceof AxiosError ? err.response?.data?.detail : err?.message;
				onPaymentError?.({ message: msg || "PAYPAL_UI_ERROR", code: "PAYPAL_UI_ERROR" });
			}
		};

		void loadPaypalUI();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedMethod]);

	/*
	 * PayPal → 다른 결제 수단으로 전환 시 PayPal UI 관련 상태를 리셋합니다.
	 * 다시 PayPal을 선택했을 때 UI가 재렌더링되지 않는 문제를 방지합니다.
	 */
	useEffect(() => {
		if (selectedMethod?.method === "PAYPAL") return;

		paypalInitializedRef.current = false;
		setPaypalUiStatus("idle");

		const paypalContainer = document.getElementById("portone-paypal-ui-container");
		if (paypalContainer) {
			paypalContainer.innerHTML = "";
		}
	}, [selectedMethod]);

	useEffect(() => {
		if (!open) return;

		// 모달이 새로 열릴 때 PayPal 상태 초기화 (에러 메시지 제거)
		paypalInitializedRef.current = false;
		setPaypalUiStatus("idle");

		const paypalContainer = document.getElementById("portone-paypal-ui-container");
		if (paypalContainer) {
			paypalContainer.innerHTML = "";
		}
	}, [open]);

	return (
		<Popup.Popup
			open={open}
			onOpenChange={onHandleOpenChange}
		>
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

					{/* PayPal UI Container */}
					{selectedMethod?.method === "PAYPAL" && (
						<div className="my-4">
							{paypalUiStatus === "loading" && (
								<div className="flex flex-col items-center justify-center p-4 text-center rounded-md bg-gray-50 min-h-[120px]">
									<svg
										className="w-8 h-8 mb-3 text-blue-500 animate-spin"
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
									<p className="font-semibold">페이팔 결제 버튼을 준비 중입니다...</p>
								</div>
							)}

							<div
								id="portone-paypal-ui-container"
								className="portone-ui-container pc-cart-payment-select-modal flex justify-center w-full min-w-full"
								style={{ display: paypalUiStatus === "rendered" ? "flex" : "none" }}
							></div>

							{/* 환율 정보 표시 */}
							<p className="mt-3 text-xs text-center text-gray-500">
								{krwToUsdRate !== null
									? `1,000 KRW ≈ ${(1000 * krwToUsdRate).toFixed(4)} USD`
									: "환율 정보를 불러오는 중..."}
							</p>

							{paypalUiStatus === "error" && (
								<p className="mt-2 text-sm text-red-600 text-center">페이팔 버튼 로드 중 오류가 발생했습니다.</p>
							)}
						</div>
					)}

					<Popup.PopupFooter className="mt-6">
						<Popup.PopupButton
							className="text-black bg-white border-2 border-black"
							onClick={() => onHandleOpenChange(false)}
						>
							취소
						</Popup.PopupButton>
						{selectedMethod?.method !== "PAYPAL" && (
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
						)}
					</Popup.PopupFooter>
				</div>
			</Popup.PopupContent>
		</Popup.Popup>
	);
};
