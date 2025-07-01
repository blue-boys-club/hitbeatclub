"use client";

import { Popup, PopupContent, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import { Paypal, Card } from "@/assets/svgs";
import { memo, useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import * as PortOne from "@portone/browser-sdk/v2";
import { PORTONE_STORE_ID, PORTONE_CHANNEL_KEY } from "@/lib/payment.constant";
import {
	useSubscription,
	type AugmentedSubscribeFormValues,
	type BaseBillingKeyIssueArgs,
} from "@/features/subscribe/hooks/useSubscription";
import { useQuery } from "@tanstack/react-query";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { useExchangeRateLatestQueryOptions } from "@/apis/exchange-rate/query/exchange-rate.query-options";

interface SubscribePaymentMethodModalProps {
	isOpen: boolean;
	onClose: (open: boolean) => void;
	/** 결제 플랜 (YEAR | MONTH) */
	plan: "YEAR" | "MONTH";
	/** 실제 결제 금액 (KRW) */
	amount: number;
}

export const SubscribePaymentMethodModal = memo(
	({ isOpen, onClose, plan, amount }: SubscribePaymentMethodModalProps) => {
		const { initiateBillingKeyIssue, submitSubscription, isProcessingPayment, isSubmitting } = useSubscription();

		const { data: userMe } = useQuery(getUserMeQueryOption());

		// PayPal SPB UI 관련 상태
		const [paypalUiStatus, setPaypalUiStatus] = useState<"idle" | "loading" | "rendered" | "error">("idle");
		const paypalInitializedRef = useRef(false);

		const { data: exchangeRateData } = useQuery(useExchangeRateLatestQueryOptions("KRW", "USD"));
		const krwToUsdRate = exchangeRateData?.rate ?? null;

		// 로딩 플래그
		const [isProcessing, setIsProcessing] = useState(false);

		// 모달 close 시 cleanup
		useEffect(() => {
			if (!isOpen) {
				setIsProcessing(false);
				paypalInitializedRef.current = false;
				setPaypalUiStatus("idle");
				const el = document.getElementById("portone-paypal-ui-container-subscribe");
				if (el) el.innerHTML = "";
			}
		}, [isOpen]);

		const commonSubscribeSubmit = async (methodType: "CARD" | "PAYPAL", billingKey?: string | null) => {
			const data: AugmentedSubscribeFormValues = {
				subscriptionPlan: plan,
				hitcode: "",
				paymentMethodType: methodType,
				customerName: userMe?.name ?? "",
				email: userMe?.email ?? "",
				phone: userMe?.phoneNumber ?? "",
				method: { type: methodType, billingKey: billingKey ?? undefined },
			} as any;
			await submitSubscription(data);
		};

		// 카드 결제 핸들러 (BillingKey)
		const handleCardPayment = async () => {
			if (isSubmitting || isProcessingPayment) return;
			try {
				setIsProcessing(true);

				// 1) Save pending subscription form to sessionStorage for callback page
				const pendingForm: AugmentedSubscribeFormValues = {
					subscriptionPlan: plan,
					hitcode: "",
					paymentMethodType: "CARD",
					customerName: userMe?.name ?? "",
					email: userMe?.email ?? "",
					phone: userMe?.phoneNumber ?? "",
					// billingKey will be appended in callback page
					method: { type: "CARD" } as any,
				};
				try {
					if (typeof window !== "undefined") {
						window.sessionStorage.setItem("pending-subscribe-form", JSON.stringify(pendingForm));
					}
				} catch (err) {
					console.error("Failed to save pending subscribe form", err);
				}

				const args: BaseBillingKeyIssueArgs = {
					orderName: plan === "YEAR" ? "HITBEAT 연간 멤버십" : "HITBEAT 월간 멤버십",
					amount,
					redirectUrl: `${window.location.origin}/subscribe/callback/card`,
					customer: { customerId: `hitbeatclub-${userMe?.id ?? "guest"}` },
				};
				const billingKey = await initiateBillingKeyIssue("CARD", args);
				if (!billingKey) return;
				// If billingKey returned without redirect (rare), submit immediately
				await commonSubscribeSubmit("CARD", billingKey);
				onClose(false);
			} catch (e) {
				console.error(e);
			} finally {
				setIsProcessing(false);
			}
		};

		// PayPal SPB UI initialize & flow (one-time payment, may redirect)
		const handlePaypalInit = useCallback(async () => {
			if (paypalInitializedRef.current) return;
			setPaypalUiStatus("loading");
			try {
				// PayPal needs USD amount
				const usdAmount = krwToUsdRate ? Math.round(amount * krwToUsdRate) : amount;
				const usdScaleFactor = 10 ** 2;

				// Save pending form beforehand (similar to CARD)
				const hitcodeStored =
					typeof window !== "undefined" ? window.sessionStorage.getItem("pending-hitcode") || "" : "";
				const pendingForm: AugmentedSubscribeFormValues = {
					subscriptionPlan: plan,
					hitcode: hitcodeStored,
					paymentMethodType: "PAYPAL",
					customerName: userMe?.name ?? "",
					email: userMe?.email ?? "",
					phone: userMe?.phoneNumber ?? "",
					method: { type: "PAYPAL" } as any,
				} as any;
				try {
					if (typeof window !== "undefined") {
						window.sessionStorage.setItem("pending-subscribe-form", JSON.stringify(pendingForm));
					}
				} catch (err) {
					console.error("Failed to save pending subscribe form for PayPal", err);
				}

				await PortOne.loadPaymentUI(
					{
						uiType: "PAYPAL_SPB",
						storeId: PORTONE_STORE_ID,
						channelKey: PORTONE_CHANNEL_KEY.PAYPAL,
						paymentId: `subscribe-paypal-${uuidv4()}`,
						orderName: plan === "YEAR" ? "HITBEAT 연간 멤버십" : "HITBEAT 월간 멤버십",
						totalAmount: usdAmount * usdScaleFactor,
						currency: PortOne.Entity.Currency.USD,
						redirectUrl: `${window.location.origin}/subscribe/callback/paypal`,
						customer: {
							fullName: userMe?.name,
							phoneNumber: userMe?.phoneNumber,
							email: userMe?.email,
							customerId: `hitbeatclub-${userMe?.id}`,
						},
					},
					{
						onPaymentSuccess: async () => {
							try {
								await commonSubscribeSubmit("PAYPAL", null);
								onClose(false);
							} catch (e) {
								console.error(e);
							}
						},
						onPaymentFail: () => {
							setPaypalUiStatus("error");
							paypalInitializedRef.current = false;
							const el = document.getElementById("portone-paypal-ui-container-subscribe");
							if (el) el.innerHTML = "";
						},
					},
				);
				paypalInitializedRef.current = true;
				setPaypalUiStatus("rendered");
			} catch (e) {
				console.error(e);
				setPaypalUiStatus("error");
				paypalInitializedRef.current = false;
			}
		}, [amount, krwToUsdRate, plan, userMe, commonSubscribeSubmit, onClose]);

		return (
			<Popup
				open={isOpen}
				onOpenChange={onClose}
				variant="mobile"
			>
				<PopupContent className="w-[calc(238px+42px)] flex flex-col bg-[#DADADA]">
					<PopupHeader>
						<PopupTitle className="text-[12px] leading-100% font-bold">결제 수단을 선택해주세요</PopupTitle>
					</PopupHeader>
					<div className="flex flex-col gap-1 px-2 pb-2">
						{/* Card */}
						{paypalUiStatus !== "loading" && paypalUiStatus !== "rendered" && (
							<button
								onClick={handleCardPayment}
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

						{/* PayPal button or loader */}
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
									className="w-6 h-6 mb-2 animate-spin text-blue-500"
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
								<p className="text-[12px] font-semibold">PayPal 버튼 준비 중...</p>
							</div>
						)}

						{/* PayPal Container */}
						<div
							id="portone-paypal-ui-container-subscribe"
							className="portone-ui-container flex justify-center w-full"
							style={{ display: paypalUiStatus === "rendered" ? "flex" : "none" }}
						/>
						{paypalUiStatus === "rendered" && (
							<p className="mt-1 text-[11px] text-center font-medium">PayPal 버튼을 눌러 결제하세요</p>
						)}
					</div>
				</PopupContent>
			</Popup>
		);
	},
);

SubscribePaymentMethodModal.displayName = "SubscribePaymentMethodModal";
