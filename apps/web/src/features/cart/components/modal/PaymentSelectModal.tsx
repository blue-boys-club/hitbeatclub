"use client";

import { useCallback, useEffect, useState } from "react";
import * as PortOne from "@portone/browser-sdk/v2";
import * as Popup from "@/components/ui/Popup";
import { cn } from "@/common/utils";
import { type PaymentError } from "@portone/browser-sdk/v2";

interface PaymentSelectModalProps {
	trigger?: React.ReactNode;
	total: number;
	orderName: string;
	orderData: any;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	onPaymentComplete?: (result: any) => void;
	onPaymentError?: (error: any) => void;
}

type PaymentMethod = {
	id: string;
	name: string;
	method: string;
	icon: string;
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
		id: "easy-pay",
		name: "간편결제",
		method: "EASY_PAY",
		icon: "📱",
	},
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
];

// NICE Payments에서 지원하는 간편결제 목록
const easyPayProviders: EasyPayProvider[] = [
	{
		id: "PAYCO",
		name: "페이코",
		bgColor: "#FF0000",
		icon: "🎨",
		availablePayMethods: ["TRANSFER"], // SSG페이는 계좌 결제만 다이렉트 호출 가능
	},
	// {
	// 	id: "SSGPAY",
	// 	name: "SSG페이",
	// 	bgColor: "#FFD400",
	// 	icon: "🎨",
	// 	availablePayMethods: ["TRANSFER"], // SSG페이는 계좌 결제만 다이렉트 호출 가능
	// },
	{
		id: "KAKAOPAY",
		name: "카카오페이",
		bgColor: "#FFEB00",
		icon: "🎨",
		availablePayMethods: ["CARD", "CHARGE"], // 네이버페이는 카드 결제, 포인트 결제 가능
	},
	{
		id: "NAVERPAY",
		name: "네이버페이",
		bgColor: "#03C75A",
		icon: "🎨",
		availablePayMethods: ["CARD", "CHARGE"], // 네이버페이는 카드 결제, 포인트 결제 가능
	},
	{
		id: "SAMSUNGPAY",
		name: "삼성페이",
		bgColor: "#1428A0",
		icon: "🎨",
		availablePayMethods: [],
	},
	{
		id: "APPLEPAY",
		name: "애플페이",
		bgColor: "#000000",
		icon: "🎨",
		availablePayMethods: [],
		checkIsAvailable: () => typeof window !== "undefined" && "ApplePaySession" in window,
	},
	{
		id: "LPAY",
		name: "L페이",
		bgColor: "#FF3300",
		icon: "🎨",
		availablePayMethods: [],
	},
	// {
	// 	id: "TOSSPAY",
	// 	name: "토스페이",
	// 	bgColor: "#0064FF",
	// 	icon: "🎨",
	// 	availablePayMethods: [],
	// },
	{
		id: "SKPAY",
		name: "SK페이(11페이)",
		bgColor: "#F03C3C",
		icon: "🎨",
		availablePayMethods: [],
	},
];

export const PaymentSelectModal = ({
	trigger,
	total,
	orderName,
	orderData,
	open = false,
	onOpenChange,
	onPaymentComplete,
	onPaymentError,
}: PaymentSelectModalProps) => {
	const [isOpen, setIsOpen] = useState(open);
	const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
	const [selectedEasyPayProvider, setSelectedEasyPayProvider] = useState<EasyPayProvider | null>(null);
	const [easyPayAvailableMethod, setEasyPayAvailableMethod] = useState<string | null>(null);

	useEffect(() => {
		setIsOpen(open);
	}, [open]);

	const onHandleOpenChange = (open: boolean) => {
		console.log("open", open);
		setIsOpen(open);
		onOpenChange?.(open);
	};

	const handlePaymentRequest = async () => {
		if (!selectedMethod) {
			alert("결제 수단을 선택해주세요.");
			return;
		}

		if (selectedMethod.method === "EASY_PAY" && !selectedEasyPayProvider) {
			alert("간편결제 수단을 선택해주세요.");
			return;
		}

		try {
			const paymentId = crypto.randomUUID();
			const paymentConfig: any = {
				// TODO: Move to env
				storeId: "store-c9824a41-6612-4e07-863c-07a9f0cc0ee4",
				paymentId,
				orderName,
				totalAmount: total,
				currency: PortOne.Entity.Currency.KRW,
				// TODO: Move to env
				channelKey: "channel-key-d4ff4729-56d9-4f71-a64e-ac323360206c",
				payMethod: selectedMethod.method,
				customer: {
					fullName: "고객명",
					phoneNumber: "010-0000-0000",
					email: "customer@example.com",
				},
			};

			// 상품권 결제인 경우 추가 설정
			if (selectedMethod.method === "GIFT_CERTIFICATE") {
				paymentConfig.giftCertificate = {
					certificateType: "CULTURELAND", // 나이스페이먼츠는 컬쳐랜드만 지원
				};
				paymentConfig.bypass = {
					nice_v2: {
						MallUserID: "customer-id", // 필수 파라미터
					},
				};
			}

			// 간편결제 설정
			if (selectedMethod.method === "EASY_PAY" && selectedEasyPayProvider) {
				paymentConfig.easyPay = {
					easyPayProvider: selectedEasyPayProvider.id,
				};

				// 네이버페이와 SSG페이는 availablePayMethods 설정 필요
				if (selectedEasyPayProvider.id === "NAVERPAY" || selectedEasyPayProvider.id === "SSGPAY") {
					if (easyPayAvailableMethod) {
						paymentConfig.easyPay.availablePayMethods = [easyPayAvailableMethod];
					}
				}
			}

			try {
				const result = await PortOne.requestPayment(paymentConfig);

				// result.code가 FAILURE로 시작하면 에러로 처리
				if (result && "code" in result && typeof result.code === "string" && result.code.startsWith("FAILURE")) {
					const error = {
						message: result.message || "결제가 실패했습니다.",
						code: result.code,
						...result,
					} as PaymentError;
					onPaymentError?.(error);
				} else if (result) {
					onPaymentComplete?.(result);
				} else {
					// result가 없는 경우 처리
					onPaymentError?.({ message: "결제 결과를 받지 못했습니다.", code: "FAILURE_NO_RESULT" });
				}
			} catch (error) {
				onPaymentError?.(error);
				console.error("Payment error:", error);
			}
		} catch (error) {
			onPaymentError?.(error);
			console.error("Payment error:", error);
		}
	};

	const handleMethodSelect = (method: PaymentMethod) => {
		setSelectedMethod(method);
		if (method.method !== "EASY_PAY") {
			setSelectedEasyPayProvider(null);
			setEasyPayAvailableMethod(null);
		}
	};

	const resetPaymentState = useCallback(() => {
		setSelectedMethod(null);
		setSelectedEasyPayProvider(null);
		setEasyPayAvailableMethod(null);
	}, []);

	useEffect(() => {
		if (!isOpen) {
			resetPaymentState();
		}
	}, [isOpen, resetPaymentState]);

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

					<div className="grid grid-cols-3 gap-3 mt-4">
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

					{selectedMethod?.method === "EASY_PAY" && (
						<div className="mt-5">
							<div className="text-[16px] font-semibold mb-3">간편결제 수단 선택</div>
							<div className="grid grid-cols-3 gap-3">
								{easyPayProviders
									.filter((provider) => provider.checkIsAvailable?.() ?? true)
									.map((provider) => (
										<button
											key={provider.id}
											className={cn(
												"flex flex-col items-center justify-center p-3 border-2 rounded-[5px] cursor-pointer transition-all h-[80px]",
												selectedEasyPayProvider?.id === provider.id
													? "border-black bg-gray-100"
													: "border-gray-300 hover:border-gray-500",
											)}
											style={{
												backgroundColor:
													selectedEasyPayProvider?.id === provider.id ? "#f3f4f6" : provider.bgColor + "20",
											}}
											onClick={() => {
												setSelectedEasyPayProvider(provider);
												const methods = provider.availablePayMethods || [];
												setEasyPayAvailableMethod(methods.length > 0 ? methods[0] || null : null);
											}}
										>
											<span className="mb-1 text-xl">{provider.icon}</span>
											<span className="font-bold text-[13px] font-suisse text-center">{provider.name}</span>
										</button>
									))}
							</div>

							{selectedEasyPayProvider?.availablePayMethods &&
								selectedEasyPayProvider.availablePayMethods.length > 1 && (
									<div className="mt-4">
										<div className="text-[14px] font-semibold mb-2">결제 방식 선택</div>
										<div className="flex flex-wrap gap-2">
											{selectedEasyPayProvider.availablePayMethods.map((method) => (
												<button
													key={method}
													className={cn(
														"flex items-center justify-center py-2 px-4 border-2 rounded-[5px] cursor-pointer transition-all text-[14px]",
														easyPayAvailableMethod === method
															? "border-black bg-gray-100"
															: "border-gray-300 hover:border-gray-500",
													)}
													onClick={() => setEasyPayAvailableMethod(method)}
												>
													{method === "CARD" ? "카드 결제" : method === "CHARGE" ? "포인트 결제" : "계좌 결제"}
												</button>
											))}
										</div>
									</div>
								)}
						</div>
					)}

					<Popup.PopupFooter className="mt-6">
						<Popup.PopupButton className="text-black bg-white border-2 border-black">취소</Popup.PopupButton>
						<Popup.PopupButton
							onClick={handlePaymentRequest}
							disabled={!selectedMethod || (selectedMethod.method === "EASY_PAY" && !selectedEasyPayProvider)}
							className={cn(
								(!selectedMethod || (selectedMethod.method === "EASY_PAY" && !selectedEasyPayProvider)) &&
									"opacity-50 cursor-not-allowed",
							)}
						>
							결제하기
						</Popup.PopupButton>
					</Popup.PopupFooter>
				</div>
			</Popup.PopupContent>
		</Popup.Popup>
	);
};
