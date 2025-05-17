import { useEffect, useState, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/common/utils";
import Link from "next/link";
import { useForm, SubmitHandler, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RecurringPeriod, subscribeFormSchema, type SubscribeFormValues } from "../schema";
import { useSubscription } from "../hooks/useSubscription";
import PortOne from "@portone/browser-sdk/v2";
import {
	PromotionCodeModal,
	SuccessModal,
	ErrorModal,
	SubscribePaymentChoiceModal,
	SubscribePaypalModal,
} from "./modals";
import { SubscribeBenefitBody } from "./SubscribeBenefitBody";
import { SubscribeFormHeader } from "./SubscribeFormHeader";
import { SubscribePrice } from "./SubscribePrice";
import { HBCGray } from "@/assets/svgs";

/**
 * 구독 폼 내용 컴포넌트
 */
export const SubscribeFormContent = () => {
	const {
		isSubscribed,
		isSubmitting,
		openModal,
		closeModal: closeOriginalModalHook,
		submitSubscription,
	} = useSubscription();
	const { toast } = useToast();

	// States for new modal flow
	const [isPaymentChoiceModalOpen, setIsPaymentChoiceModalOpen] = useState(false);
	const [isPaypalModalOpen, setIsPaypalModalOpen] = useState(false);

	// State for Toss/Card direct processing
	const [isProcessingTossCard, setIsProcessingTossCard] = useState(false);
	const [tossCardError, setTossCardError] = useState<string | null>(null);

	// React Hook Form 설정
	const methods = useForm<SubscribeFormValues>({
		resolver: zodResolver(subscribeFormSchema),
		defaultValues: {
			recurringPeriod: RecurringPeriod.YEARLY,
		},
	});

	const {
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
		reset,
	} = methods;

	// 현재 폼 값 감시
	const recurringPeriod = watch("recurringPeriod");
	const promotionCode = watch("promotionCode");
	const currentMethod = watch("method"); // Watch the method for debugging

	const subscriptionIssueName = useMemo(
		() => (recurringPeriod === RecurringPeriod.YEARLY ? "HITBEAT 연간 멤버십" : "HITBEAT 월간 멤버십"),
		[recurringPeriod],
	);

	// 구독 신청 처리 (This will be called after successful billing key acquisition)
	const processSubscription = useCallback(
		async (billingKey: string, paymentType: "tossOrCard" | "paypal") => {
			console.log(`Processing subscription with ${paymentType}, billingKey: ${billingKey}`);
			if (paymentType === "tossOrCard") {
				setValue("method", { tossOrCardBillingKey: billingKey }, { shouldValidate: true });
			} else if (paymentType === "paypal") {
				setValue("method", { paypal: { billingKey: billingKey } }, { shouldValidate: true });
			}

			// Add a brief delay to allow React to update state before reading it with watch()
			await new Promise((resolve) => setTimeout(resolve, 0));

			const formData = watch();
			console.log("Final form data for submission:", formData);

			if (isSubscribed) return;
			setIsProcessingTossCard(false); // Ensure this is reset

			try {
				await submitSubscription(formData);
				reset();
			} catch (error) {
				console.error("Subscription failed during final submission:", error);
				openModal("error"); // Ensure error modal is opened
			}
		},
		[isSubscribed, openModal, reset, setValue, submitSubscription, watch],
	);

	// Original onSubmit from RHF - this might not be directly used for submission button anymore
	// The submission is now triggered by modal success callbacks.
	const onSubmitRHF: SubmitHandler<SubscribeFormValues> = async (data) => {
		console.log("RHF onSubmit triggered with:", data);
		openModal("error");
	};

	// 구독 버튼 클릭 핸들러 - Opens the new choice modal
	const handleSubscribe = () => {
		if (isSubscribed) return;
		setIsPaymentChoiceModalOpen(true);
	};

	// --- Handler for Toss/Card direct PortOne invocation ---
	const initiateTossCardPayment = useCallback(async () => {
		if (typeof window === "undefined") return;

		setIsProcessingTossCard(true);
		setTossCardError(null);

		try {
			console.log("PortOne.requestIssueBillingKey for Toss/Card directly invoked...");
			const response = await PortOne.requestIssueBillingKey({
				storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
				channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY_RECURRING!,
				billingKeyMethod: "CARD",
				issueName: subscriptionIssueName,
				redirectUrl: `${window.location.origin}/subscribe/callback`,
			});

			if (!response) {
				console.error("Toss/Card Billing Key: No response from PortOne");
				setTossCardError("결제 서비스로부터 응답을 받지 못했습니다.");
				setIsProcessingTossCard(false);
				openModal("error");
				return;
			}

			if (response.code != null) {
				console.error("Toss/Card Billing Key Failed:", response);
				setTossCardError(response.message || "카드 정보 연동 중 오류가 발생했습니다.");
				setIsProcessingTossCard(false);
				openModal("error"); // Open generic error modal
			} else if (response.billingKey) {
				console.log("Toss/Card Billing Key Issued directly:", response.billingKey);
				// No setIsProcessingTossCard(false) here yet, do it in processSubscription
				await processSubscription(response.billingKey, "tossOrCard");
			} else {
				console.error("Toss/Card Billing Key: response missing billingKey or code:", response);
				setTossCardError("카드 정보 연동 중 알 수 없는 문제가 발생했습니다.");
				setIsProcessingTossCard(false);
				openModal("error");
			}
		} catch (err: unknown) {
			console.error("Error during Toss/Card direct billing key request:", err);
			setTossCardError(err instanceof Error ? err.message : "카드 정보 연동 중 예기치 않은 오류가 발생했습니다.");
			setIsProcessingTossCard(false);
			openModal("error");
		}
	}, [subscriptionIssueName, openModal, processSubscription]); // Added reset, processSubscription

	const handleClosePaymentChoiceModal = () => setIsPaymentChoiceModalOpen(false);

	const handleSelectTossCard = () => {
		setIsPaymentChoiceModalOpen(false);
		initiateTossCardPayment(); // Directly call the PortOne invocation
	};

	const handleSelectPaypal = () => {
		setIsPaymentChoiceModalOpen(false);
		setIsPaypalModalOpen(true);
	};

	const handlePaypalSuccess = (billingKey: string) => {
		setIsPaypalModalOpen(false);
		processSubscription(billingKey, "paypal");
	};

	const handlePaypalError = (errorMessage?: string) => {
		setIsPaypalModalOpen(false);
		// If PortonePassErrorModal is designed to take a message, pass it.
		// Otherwise, openModal("error") might be generic.
		console.error("PayPal Error Reported:", errorMessage);
		openModal("error");
	};
	const handlePaypalClose = () => setIsPaypalModalOpen(false);

	// 구독 기간 변경 시 알림 표시
	useEffect(() => {
		if (recurringPeriod === RecurringPeriod.YEARLY) {
			toast({
				description: (
					<span className="text-center text-16px justify-start text-hbc-black font-suit leading-150% tracking-016px">
						{"연간 결제시 2개월 할인 혜택이 제공 됩니다 ("}
						<span className="text-hbc-red">20% 할인</span>
						{")"}
					</span>
				),
			});
		} else {
			toast({
				description: (
					<span className="text-center text-16px justify-start text-hbc-black font-suit leading-150% tracking-016px">
						{"연간 결제 전환시, "}
						<span className="text-hbc-red">20% 할인</span>
						{"된 가격으로 사용 가능합니다."}
					</span>
				),
			});
		}
	}, [recurringPeriod, toast]);

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={handleSubmit(onSubmitRHF as any)}
				className="flex flex-col items-center justify-center w-full py-25px gap-20px"
			>
				<div className="flex flex-col items-start justify-start gap-6 w-full max-w-[627px]">
					<div className="inline-flex items-start self-stretch justify-between h-6">
						<SubscribeFormHeader
							isSubscribed={isSubscribed}
							recurringPeriod={recurringPeriod}
							onPeriodChange={(period) => setValue("recurringPeriod", period)}
						/>
					</div>

					<SubscribeBenefitBody isSubscribed={isSubscribed} />

					<div className="self-stretch flex flex-col justify-start items-start gap-2.5">
						<div className="h-6 flex flex-col justify-start items-center gap-[494px]">
							<div className="justify-start text-xl font-bold leading-none tracking-tight text-black uppercase font-suit">
								수수료 0%, 업로드 무제한, 그리고 수익의 시작!
							</div>
						</div>
						<div className="inline-flex items-end self-stretch justify-between">
							<SubscribePrice
								isSubscribed={isSubscribed}
								recurringPeriod={recurringPeriod}
							/>
							{!isSubscribed && (
								<div className="h-6 px-3.5 py-[3px] bg-white rounded-[30px] flex justify-center items-center gap-2.5">
									<button
										type="button"
										onClick={() => openModal("promotion")}
										className="justify-start text-base font-bold leading-relaxed text-[#3884FF] underline underline-offset-2 font-suit cursor-pointer"
									>
										{!promotionCode ? "히트 코드 입력" : `코드 적용 완료: ${promotionCode}`}
									</button>
								</div>
							)}
						</div>
						<div className="self-stretch flex flex-col justify-start items-center gap-2.5">
							<div className="flex flex-col justify-start items-end gap-2.5">
								{!isSubscribed ? (
									<button
										type="button"
										className={cn(
											"px-3.5 py-[3px] group bg-hbc-black rounded-[30px]",
											"outline-[3px] outline-offset-[-3px] outline-hbc-black",
											"inline-flex justify-center items-center gap-2.5",
											"hover:bg-[#3884FF] hover:outline-[#3884FF] cursor-pointer",
											"text-base font-black leading-relaxed text-white font-suit",
										)}
										onClick={handleSubscribe}
										disabled={isSubmitting || isProcessingTossCard}
									>
										{isSubmitting || isProcessingTossCard ? "처리 중..." : "멤버십 가입하기"}
									</button>
								) : (
									<Link
										className={cn(
											"px-2.5 py-[5px] bg-hbc-red rounded-[20px] inline-flex justify-center items-center gap-10px",
											"text-16px font-black font-suit leading-100% tracking-016px text-hbc-white",
										)}
										href="/artist-studio"
									>
										아티스트 스튜디오로 이동
									</Link>
								)}
							</div>
						</div>
					</div>

					<div className="outline-[3px] outline-hbc-black w-full" />

					<HBCGray />
				</div>

				{/* Modals */}
				<PromotionCodeModal />
				<SuccessModal />
				<ErrorModal />

				{isPaymentChoiceModalOpen && (
					<SubscribePaymentChoiceModal
						isOpen={isPaymentChoiceModalOpen}
						onClose={handleClosePaymentChoiceModal}
						onSelectTossCard={handleSelectTossCard}
						onSelectPaypal={handleSelectPaypal}
						recurringPeriod={recurringPeriod}
						promotionCode={promotionCode}
					/>
				)}

				{isPaypalModalOpen && (
					<SubscribePaypalModal
						isOpen={isPaypalModalOpen}
						onClose={handlePaypalClose}
						onSuccess={handlePaypalSuccess}
						onError={handlePaypalError}
					/>
				)}
			</form>
		</FormProvider>
	);
};
