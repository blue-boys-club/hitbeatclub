import { memo, useEffect, useMemo, useState } from "react";
import { Popup, PopupButton, PopupContent, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import { PopupButton as BasicPopupButton } from "@/components/ui/PopupButton";
import { cn } from "@/common/utils/tailwind";
import { useSubscription } from "../../hooks/useSubscription";
import { RecurringPeriod, SubscribeFormValues, cardCredentialSchema } from "../../schema";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type PaymentTab = "card" | "easy";

/**
 * 멤버십 가입 확인 모달 컴포넌트
 */
export const PaymentModal = memo(() => {
	const { watch, setValue, handleSubmit } = useFormContext<SubscribeFormValues>();
	const promotionCode = watch("promotionCode");
	const recurringPeriod = watch("recurringPeriod");
	const { modals, closeModal, openModal, isSubmitting, submitSubscription } = useSubscription();
	const [activeTab, setActiveTab] = useState<PaymentTab>("card");

	useEffect(() => {
		console.log("payment modal status:", modals.payment);
	}, [modals.payment]);

	const {
		register,
		handleSubmit: handleCardSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(cardCredentialSchema),
		defaultValues: {
			number: "",
			expiryMonth: "",
			expiryYear: "",
			birthOrBusinessRegistrationNumber: "",
			passwordTwoDigits: "",
		},
	});

	const handleOnOpenChange = (open: boolean) => {
		if (!open) {
			closeModal("payment");
		}
	};

	// 신용카드 정보 제출
	const onSubmitCardInfo = (data: any) => {
		// 카드 정보를 부모 폼에 추가
		setValue(
			"method",
			{
				card: {
					credential: data,
				},
			},
			{ shouldValidate: true },
		);

		// 결제 진행
		handleSubscribeConfirm();
	};

	// 구독 확인 및 제출
	const handleSubscribeConfirm = async () => {
		try {
			// 폼 제출 처리 - 여기서 현재 폼 데이터 전체를 가져와 submitSubscription으로 전달
			const formData = watch();
			await submitSubscription(formData);

			closeModal("payment");
			// success 모달은 submitSubscription 내부에서 열립니다
		} catch (error) {
			console.error("Subscription failed:", error);
			closeModal("payment");
			openModal("error");
		}
	};

	// 선택한 구독 플랜 표시 텍스트
	const subscriptionPlanText = useMemo(
		() => (recurringPeriod === RecurringPeriod.YEARLY ? "연간 멤버십 (189,900원 결제)" : "월간 멤버십 (24,990원/월)"),
		[recurringPeriod],
	);

	// 신용카드 입력 필드 렌더링
	const renderCardForm = () => (
		<form
			onSubmit={handleCardSubmit(onSubmitCardInfo)}
			className="w-full"
		>
			<div className="flex flex-col gap-4 mb-5">
				<div>
					<label className="block mb-1 text-sm font-medium text-gray-700">카드 번호</label>
					<input
						{...register("number")}
						type="text"
						placeholder="0000-0000-0000-0000"
						className="w-full px-3 py-2 border border-gray-300 rounded-md"
						maxLength={19}
					/>
					{errors.number && <p className="mt-1 text-xs text-red-500">{errors.number.message as string}</p>}
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block mb-1 text-sm font-medium text-gray-700">만료 월 (MM)</label>
						<input
							{...register("expiryMonth")}
							type="text"
							placeholder="MM"
							className="w-full px-3 py-2 border border-gray-300 rounded-md"
							maxLength={2}
						/>
						{errors.expiryMonth && <p className="mt-1 text-xs text-red-500">{errors.expiryMonth.message as string}</p>}
					</div>
					<div>
						<label className="block mb-1 text-sm font-medium text-gray-700">만료 년도 (YY)</label>
						<input
							{...register("expiryYear")}
							type="text"
							placeholder="YY"
							className="w-full px-3 py-2 border border-gray-300 rounded-md"
							maxLength={2}
						/>
						{errors.expiryYear && <p className="mt-1 text-xs text-red-500">{errors.expiryYear.message as string}</p>}
					</div>
				</div>

				<div>
					<label className="block mb-1 text-sm font-medium text-gray-700">생년월일 (YYMMDD) 또는 사업자등록번호</label>
					<input
						{...register("birthOrBusinessRegistrationNumber")}
						type="text"
						placeholder="YYMMDD"
						className="w-full px-3 py-2 border border-gray-300 rounded-md"
						maxLength={10}
					/>
					{errors.birthOrBusinessRegistrationNumber && (
						<p className="mt-1 text-xs text-red-500">{errors.birthOrBusinessRegistrationNumber.message as string}</p>
					)}
				</div>

				<div>
					<label className="block mb-1 text-sm font-medium text-gray-700">카드 비밀번호 앞 2자리</label>
					<input
						{...register("passwordTwoDigits")}
						type="password"
						placeholder="**"
						className="w-full px-3 py-2 border border-gray-300 rounded-md"
						maxLength={2}
					/>
					{errors.passwordTwoDigits && (
						<p className="mt-1 text-xs text-red-500">{errors.passwordTwoDigits.message as string}</p>
					)}
				</div>
			</div>
		</form>
	);

	// 간편결제 옵션 렌더링
	const renderEasyPayOptions = () => (
		<div className="flex flex-col gap-4 mb-5">
			<p className="mb-2 text-sm text-gray-500">현재 지원되는 간편결제 수단을 선택해주세요.</p>
			<div className="grid grid-cols-2 gap-4">
				<button
					type="button"
					className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100"
					disabled
				>
					<span className="font-medium">카카오페이</span>
				</button>
				<button
					type="button"
					className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100"
					disabled
				>
					<span className="font-medium">토스페이</span>
				</button>
				<button
					type="button"
					className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100"
					disabled
				>
					<span className="font-medium">네이버페이</span>
				</button>
				<button
					type="button"
					className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100"
					disabled
				>
					<span className="font-medium">페이코</span>
				</button>
			</div>
			<p className="mt-2 text-xs text-red-500">간편결제는 현재 지원되지 않습니다.</p>
		</div>
	);

	return (
		<Popup
			open={modals.payment}
			onOpenChange={handleOnOpenChange}
		>
			<PopupContent className="w-[600px] max-w-[600px]">
				<PopupHeader>
					<PopupTitle className="text-[26px] font-bold">결제 정보 입력</PopupTitle>
				</PopupHeader>

				<div className="flex flex-col items-start justify-start w-full gap-25px">
					<div className="w-full mb-4">
						<span className="block mb-2 font-bold text-16px leading-32px tracking-016px">
							선택하신 멤버십 플랜: <span className="text-hbc-black">{subscriptionPlanText}</span>
						</span>

						{promotionCode && (
							<div className="p-3 mb-3 rounded-md bg-blue-50">
								<span className="font-bold text-blue-700">프로모션 코드 적용: {promotionCode}</span>
							</div>
						)}

						<div className="p-4 bg-gray-100 rounded-md">
							<span className="block mb-1 font-bold whitespace-pre-line text-16px leading-32px tracking-016px">
								💳 정기 결제 안내
							</span>
							<ul className="ml-5 text-sm text-gray-700 list-disc">
								<li>입력하신 카드 정보로 정기 결제가 이루어집니다.</li>
								<li>첫 결제 후 매월 같은 날짜에 자동으로 결제됩니다.</li>
								<li>언제든지 멤버십을 취소할 수 있습니다.</li>
							</ul>
						</div>
					</div>

					{/* 결제 방식 탭 */}
					<div className="w-full mb-4">
						<div className="flex border-b border-gray-200">
							<button
								className={cn(
									"py-2 px-4 font-medium text-sm",
									activeTab === "card"
										? "border-b-2 border-hbc-black text-hbc-black"
										: "text-gray-500 hover:text-gray-700 cursor-pointer",
								)}
								onClick={() => setActiveTab("card")}
							>
								신용카드
							</button>
							<button
								className={cn(
									"py-2 px-4 font-medium text-sm",
									activeTab === "easy"
										? "border-b-2 border-hbc-black text-hbc-black"
										: "text-gray-500 hover:text-gray-700 cursor-pointer",
								)}
								onClick={() => setActiveTab("easy")}
							>
								간편결제
							</button>
						</div>

						<div className="mt-4">{activeTab === "card" ? renderCardForm() : renderEasyPayOptions()}</div>
					</div>
				</div>

				<PopupFooter className={cn("flex", isSubmitting && "opacity-50 pointer-events-none")}>
					<PopupButton
						intent="cancel"
						onClick={() => closeModal("payment")}
						disabled={isSubmitting}
					>
						취소
					</PopupButton>

					<BasicPopupButton
						intent="confirm"
						className="bg-hbc-red"
						onClick={
							activeTab === "card"
								? handleCardSubmit(onSubmitCardInfo)
								: () => alert("간편결제는 현재 지원되지 않습니다.")
						}
						disabled={isSubmitting || activeTab === "easy"}
					>
						{isSubmitting ? "처리 중..." : "결제하기"}
					</BasicPopupButton>
				</PopupFooter>
			</PopupContent>
		</Popup>
	);
});

PaymentModal.displayName = "PaymentModal";
