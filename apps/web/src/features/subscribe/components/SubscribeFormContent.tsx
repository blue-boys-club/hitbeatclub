"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/common/utils";
import Link from "next/link";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	useSubscription,
	type AugmentedSubscribeFormValues,
	type BaseBillingKeyIssueArgs,
	type PaymentGatewayType,
} from "../hooks/useSubscription";
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
import { SubscribeFormSchema, SubscribeFormValue } from "../schema";
import { useQuery } from "@tanstack/react-query";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";

/**
 * 구독 폼의 주요 콘텐츠를 렌더링하고 구독 과정을 처리하는 컴포넌트입니다.
 * 사용자의 입력, 결제 수단 선택, PortOne 연동, 모달 관리를 담당합니다.
 */
export const SubscribeFormContent = () => {
	const { data: userMe, isSuccess: isUserMeSuccess } = useQuery(getUserMeQueryOption());
	const {
		isMembership,
		isSubmitting: isFinalSubmitting,
		isProcessingPayment,
		openModal,
		submitSubscription,
		initiateBillingKeyIssue,
	} = useSubscription();
	const { toast } = useToast();

	// Modal States
	const [isPaymentChoiceModalOpen, setIsPaymentChoiceModalOpen] = useState(false);
	const [isPaypalModalOpen, setIsPaypalModalOpen] = useState(false);

	// Local button specific loading states (can be helpful for individual button feedback)
	const [isInitiatingCard, setIsInitiatingCard] = useState(false);
	const [isInitiatingToss, setIsInitiatingToss] = useState(false);

	const methods = useForm<SubscribeFormValue>({
		resolver: zodResolver(SubscribeFormSchema),
		defaultValues: {
			recurringPeriod: "yearly",
		},
	});

	const { handleSubmit, setValue, watch, reset } = methods;

	const recurringPeriod = watch("recurringPeriod");
	const promotionCode = watch("promotionCode");

	/** 구독 상품명 (연간/월간) */
	const subscriptionIssueName = useMemo(
		() => (recurringPeriod === "yearly" ? "HITBEAT 연간 멤버십" : "HITBEAT 월간 멤버십"),
		[recurringPeriod],
	);

	/** 현재 구독 상품 가격 */
	const currentAmount = useMemo(() => (recurringPeriod === "yearly" ? 189900 : 24990), [recurringPeriod]);

	/**
	 * 빌링키 발급 후 실제 구독 처리를 위해 `useSubscription`의 `submitSubscription`을 호출합니다.
	 * @param billingKey 발급된 빌링키
	 * @param paymentType 선택된 결제 수단 타입 (내부 식별용)
	 */
	const processSubscriptionWithBillingKey = useCallback(
		async (billingKey: string, paymentType: PaymentGatewayType | "PAYPAL") => {
			if (!isUserMeSuccess) return;

			console.log(`Local processSubscription with ${paymentType}, billingKey: ${billingKey}`);

			// Map PaymentGatewayType to the string expected by the form schema for `method.type`
			// Assuming schema expects 'CARD', 'TOSS', 'PAYPAL'
			const formMethodType = paymentType === "TOSS_EASY_PAY" ? "TOSS" : paymentType;

			setValue("method", { type: formMethodType, billingKey }, { shouldValidate: true });

			// Ensure RHF state is updated before reading it
			await new Promise((resolve) => setTimeout(resolve, 0));

			const currentFormValues = watch();
			const augmentedData: AugmentedSubscribeFormValues = {
				...currentFormValues,
				paymentMethodType: paymentType, // This uses the full PaymentGatewayType | "PAYPAL"
				// TODO: Collect these from actual form fields if they exist
				customerName: userMe.name,
				email: userMe.email,
				phone: userMe.phoneNumber,
				method: { type: formMethodType, billingKey }, // Use mapped type for form data consistency
			};

			console.log("Final augmented data for submission via hook:", augmentedData);

			if (isMembership) return;

			try {
				await submitSubscription(augmentedData);
				reset(); // Reset form on successful subscription
			} catch (error) {
				// Error handling is primarily done within the hook, but can add UI specific feedback here
				console.error("Error during handoff to hook's submitSubscription:", error);
			}
		},
		[isMembership, reset, setValue, submitSubscription, watch, isUserMeSuccess, userMe],
	);

	/**
	 * RHF의 기본 onSubmit 핸들러입니다. (주요 제출 경로는 아님)
	 * 직접적인 결제 시작은 각 결제 버튼 핸들러에서 수행됩니다.
	 */
	const onSubmitRHF: SubmitHandler<SubscribeFormValue> = async (data) => {
		console.log("RHF onSubmit triggered (should not be primary submission path):", data);
		openModal("error"); // Fallback error if this path is somehow used for submission
	};

	/**
	 * "멤버십 가입하기" 버튼 클릭 시 결제 수단 선택 모달을 엽니다.
	 */
	const handleSubscribeButtonClick = () => {
		if (isMembership) return;
		setIsPaymentChoiceModalOpen(true);
	};

	/** 빌링키 발급 요청에 필요한 공통 인자들 */
	const commonBillingKeyArgs = useMemo(
		(): Omit<BaseBillingKeyIssueArgs, "redirectUrl"> => ({
			orderName: subscriptionIssueName,
			amount: currentAmount,
			customer: {
				// TODO: 실제 고객 ID로 교체 필요. 현재는 플레이스홀더.
				// 이 값이 없다면 PortOne SDK에서 customerId를 자동으로 생성해줍니다.
				// 특정 고객을 지정해야 하는 경우에만 사용합니다.
				customerId: "customer_123_test_id",
			},
		}),
		[subscriptionIssueName, currentAmount],
	);

	/**
	 * 지정된 PortOne 결제 수단으로 빌링키 발급을 시작하고 후속 처리를 진행합니다.
	 * @param paymentGatewayType PortOne 결제 게이트웨이 타입 (예: 'CARD', 'TOSS_EASY_PAY')
	 * @param setButtonProcessing 해당 버튼의 로딩 상태를 설정하는 함수
	 */
	const initiatePortOnePayment = useCallback(
		async (paymentGatewayType: PaymentGatewayType, setButtonProcessing: (isLoading: boolean) => void) => {
			if (typeof window === "undefined") return;
			setButtonProcessing(true);

			const billingKeyArgs: BaseBillingKeyIssueArgs = {
				...commonBillingKeyArgs,
				// Callback URL은 PortOne 대시보드에 등록된 값과 일치해야 할 수 있습니다.
				// 또한, 실제 환경에서는 HTTPS를 사용해야 합니다.
				redirectUrl: `${window.location.origin}/subscribe/callback/${paymentGatewayType.toLowerCase()}`,
			};

			console.log(`Calling hook's initiateBillingKeyIssue for ${paymentGatewayType}...`);

			try {
				const billingKey = await initiateBillingKeyIssue(paymentGatewayType, billingKeyArgs);

				if (billingKey) {
					console.log(`${paymentGatewayType} Billing Key Issued via hook:`, billingKey);
					await processSubscriptionWithBillingKey(billingKey, paymentGatewayType);
				} else {
					console.error(`${paymentGatewayType} Billing Key issuance failed (as reported by hook).`);
					// Error modal is opened by the hook
				}
			} catch (error) {
				console.error(`Error during ${paymentGatewayType} Billing Key issuance:`, error);
				openModal("error");
			} finally {
				setButtonProcessing(false); // Reset button-specific loading state regardless of outcome
			}
		},
		[commonBillingKeyArgs, initiateBillingKeyIssue, processSubscriptionWithBillingKey, openModal],
	);

	// Modal close handlers
	const handleClosePaymentChoiceModal = () => setIsPaymentChoiceModalOpen(false);

	// Payment selection handlers
	const handleSelectCard = () => {
		setIsPaymentChoiceModalOpen(false);
		initiatePortOnePayment("CARD", setIsInitiatingCard);
	};

	const handleSelectToss = () => {
		setIsPaymentChoiceModalOpen(false);
		initiatePortOnePayment("TOSS_EASY_PAY", setIsInitiatingToss);
	};

	const handleSelectPaypal = () => {
		setIsPaymentChoiceModalOpen(false);
		setIsPaypalModalOpen(true);
	};

	// PayPal modal handlers
	const handlePaypalSuccess = (billingKey: string) => {
		setIsPaypalModalOpen(false);
		processSubscriptionWithBillingKey(billingKey, "PAYPAL");
	};
	const handlePaypalError = (errorMessage?: string) => {
		setIsPaypalModalOpen(false);
		console.error("PayPal Error Reported:", errorMessage);
		openModal("error"); // Open generic error modal
	};
	const handlePaypalClose = () => setIsPaypalModalOpen(false);

	// 구독 기간 변경 시 알림 (토스트 메시지) 표시
	useEffect(() => {
		// This effect provides user feedback on period change, not directly related to submission logic
		if (recurringPeriod === "yearly") {
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

	// Determine if any payment process is active for disabling the main button
	const isAnyPaymentProcessing = isFinalSubmitting || isProcessingPayment || isInitiatingCard || isInitiatingToss;

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={handleSubmit(onSubmitRHF)}
				className="flex flex-col items-center justify-center w-full py-25px gap-20px"
			>
				<div className="flex flex-col items-start justify-start gap-6 w-full max-w-[627px]">
					{/* Header: Period Toggle & Title */}
					<div className="inline-flex items-start self-stretch justify-between h-6">
						<SubscribeFormHeader
							isSubscribed={isMembership}
							recurringPeriod={recurringPeriod}
							onPeriodChange={(period) => setValue("recurringPeriod", period)}
						/>
					</div>

					{/* Benefits Section */}
					<SubscribeBenefitBody isSubscribed={isMembership} />

					{/* Pricing & Call to Action */}
					<div className="self-stretch flex flex-col justify-start items-start gap-2.5">
						<div className="h-6 flex flex-col justify-start items-center gap-[494px]">
							<div className="justify-start text-xl font-bold leading-none tracking-tight text-black uppercase font-suit">
								수수료 0%, 업로드 무제한, 그리고 수익의 시작!
							</div>
						</div>
						<div className="inline-flex items-end self-stretch justify-between">
							<SubscribePrice
								isSubscribed={isMembership}
								recurringPeriod={recurringPeriod}
							/>
							{!isMembership && (
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
								{!isMembership ? (
									<button
										type="button"
										className={cn(
											"px-3.5 py-[3px] group bg-hbc-black rounded-[30px]",
											"outline-[3px] outline-offset-[-3px] outline-hbc-black",
											"inline-flex justify-center items-center gap-2.5",
											"hover:bg-[#3884FF] hover:outline-[#3884FF] cursor-pointer",
											"text-base font-black leading-relaxed text-white font-suit",
										)}
										onClick={handleSubscribeButtonClick}
										disabled={isAnyPaymentProcessing}
									>
										{isAnyPaymentProcessing ? "처리 중..." : "멤버십 가입하기"}
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

					{/* Divider & Logo */}
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
						onSelectCard={handleSelectCard}
						onSelectToss={handleSelectToss}
						onSelectPaypal={handleSelectPaypal}
						recurringPeriod={recurringPeriod}
						promotionCode={promotionCode}
						isInitiatingCard={isInitiatingCard}
						isInitiatingToss={isInitiatingToss}
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
