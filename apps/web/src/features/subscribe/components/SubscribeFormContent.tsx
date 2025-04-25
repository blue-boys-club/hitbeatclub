import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/common/utils";
import Link from "next/link";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RecurringPeriod, subscribeFormSchema, type SubscribeFormValues } from "../schema";
import { useSubscription } from "../hooks/useSubscription";
import { PromotionCodeModal, PaymentModal, SuccessModal, ErrorModal } from "./modals";
import { SubscribeBenefitBody } from "./SubscribeBenefitBody";
import { SubscribeFormHeader } from "./SubscribeFormHeader";
import { SubscribePrice } from "./SubscribePrice";
import { HBCGray } from "@/assets/svgs";

/**
 * 구독 폼 내용 컴포넌트
 */
export const SubscribeFormContent = () => {
	const { isSubscribed, isSubmitting, openModal, submitSubscription } = useSubscription();
	const { toast } = useToast();

	// React Hook Form 설정
	const methods = useForm({
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

	// 구독 신청 처리
	const onSubmit: SubmitHandler<SubscribeFormValues> = async (data) => {
		if (isSubscribed) return;

		try {
			await submitSubscription(data);
			reset();
		} catch (error) {
			console.error("Subscription failed:", error);
		}
	};

	// 구독 버튼 클릭 핸들러
	const handleSubscribe = () => {
		if (isSubscribed) return;
		openModal("payment");
	};

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
				onSubmit={handleSubmit(onSubmit as any)}
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
										disabled={isSubmitting}
									>
										{isSubmitting ? "처리 중..." : "멤버십 가입하기"}
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
				<PaymentModal />
				<SuccessModal />
				<ErrorModal />
			</form>
		</FormProvider>
	);
};
