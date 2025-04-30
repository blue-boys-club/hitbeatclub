import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
	Popup,
	PopupButton,
	PopupContent,
	PopupDescription,
	PopupFooter,
	PopupHeader,
	PopupTitle,
} from "@/components/ui/Popup";
import { PopupButton as BasicPopupButton } from "@/components/ui/PopupButton";
import { cn } from "@/common/utils/tailwind";
import { useSubscription } from "../../hooks/useSubscription";
import { RecurringPeriod, SubscribeFormValues, cardCredentialSchema } from "../../schema";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PortOne from "@portone/browser-sdk/v2";
import { z } from "zod";

type PaymentTab = "card" | "easy" | "paypal";
// Infer the type from the Zod schema
type CardCredentialValues = z.infer<typeof cardCredentialSchema>;

/**
 * 멤버십 가입 확인 모달 컴포넌트
 */
export const SubscribePaymentModal = memo(() => {
	const { watch, setValue } = useFormContext<SubscribeFormValues>();
	const promotionCode = watch("promotionCode");
	const recurringPeriod = watch("recurringPeriod");
	const { modals, closeModal, openModal, isSubmitting, submitSubscription } = useSubscription();
	const [activeTab, setActiveTab] = useState<PaymentTab>("card");
	const [paypalBillingKey, setPaypalBillingKey] = useState<string | null>(null); // State for PayPal billing key
	const [paypalError, setPaypalError] = useState<string | null>(null); // State for PayPal errors
	const [isPaypalUILoaded, setIsPaypalUILoaded] = useState(false); // Track if PortOne UI is loaded

	const {
		register,
		handleSubmit: handleCardSubmit,
		formState: { errors },
		reset: resetCardForm, // Get reset function for card form
	} = useForm<CardCredentialValues>({
		// Use inferred type
		resolver: zodResolver(cardCredentialSchema),
		// defaultValues can be omitted if fields are empty strings,
		// or kept for clarity
		defaultValues: {
			number: "",
			expiryMonth: "",
			expiryYear: "",
			birthOrBusinessRegistrationNumber: "",
			passwordTwoDigits: "",
		},
	});

	const handleCloseModal = useCallback(() => {
		closeModal("payment");
		setActiveTab("card"); // Reset tab to default
		setPaypalBillingKey(null); // Reset paypal state
		setPaypalError(null);
		setIsPaypalUILoaded(false);
		resetCardForm(); // Reset card form fields
	}, [closeModal, resetCardForm]);

	const handleOnOpenChange = (open: boolean) => {
		if (!open) {
			handleCloseModal();
		}
	};

	// 신용카드 정보 제출 핸들러
	const onSubmitCardInfo = (data: CardCredentialValues) => {
		// Use inferred type
		setValue(
			"method",
			{
				card: {
					credential: data,
				},
			},
			{ shouldValidate: true }, // Trigger validation on parent form if needed
		);
		// Proceed with the actual subscription submission
		handleSubscribeConfirm();
	};

	// 구독 확인 및 최종 제출 (모든 탭 공통)
	const handleSubscribeConfirm = async () => {
		try {
			// Ensure method is set correctly based on activeTab before submitting
			if (activeTab === "paypal" && paypalBillingKey) {
				setValue("method", { paypal: { billingKey: paypalBillingKey } }, { shouldValidate: true });
			}
			// Card details are set via onSubmitCardInfo which calls this function

			// Get the latest form data and submit
			const formData = watch();
			await submitSubscription(formData);

			handleCloseModal(); // Close and reset state on success
			// Success modal is opened within submitSubscription
		} catch (error) {
			console.error("Subscription failed:", error);
			handleCloseModal(); // Close and reset state on error
			openModal("error");
		}
	};

	// 선택한 구독 플랜 표시 텍스트
	const subscriptionPlanText = useMemo(
		() => (recurringPeriod === RecurringPeriod.YEARLY ? "연간 멤버십 (189,900원 결제)" : "월간 멤버십 (24,990원/월)"),
		[recurringPeriod],
	);

	const subscriptionPaypalText = useMemo(
		() => (recurringPeriod === RecurringPeriod.YEARLY ? "HITBEAT 연간 멤버십" : "HITBEAT 월간 멤버십"),
		[recurringPeriod],
	);

	// 신용카드 입력 필드 렌더링
	const renderCardForm = () => (
		// The form tag here is only for grouping inputs and handling submit via RHF's handleSubmit
		// The actual submission logic is triggered by the main button in the footer
		<form
			// onSubmit={handleCardSubmit(onSubmitCardInfo)} // Remove direct submit handler here
			className="w-full"
			noValidate // Prevent browser validation, rely on RHF/Zod
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
			<p className="mb-2 text-sm text-gray-500">간편결제 수단을 선택해주세요.</p>
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

	// 페이팔 UI 로드 및 빌링 키 발급 처리
	const loadPaypal = useCallback(async () => {
		if (typeof window !== "undefined" && !isPaypalUILoaded && activeTab === "paypal") {
			setPaypalError(null); // Clear previous errors
			setPaypalBillingKey(null); // Clear previous key
			setIsPaypalUILoaded(true); // Mark as attempting to load

			try {
				console.log("Attempting to load PayPal UI...");
				await PortOne.loadIssueBillingKeyUI(
					{
						uiType: "PAYPAL_RT",
						storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
						issueName: subscriptionPaypalText,
						billingKeyMethod: "PAYPAL",
						channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY_PAYPAL!,
					},
					{
						onIssueBillingKeySuccess: (response) => {
							console.log("PayPal Billing Key Issued:", response);
							if (response.billingKey) {
								setPaypalBillingKey(response.billingKey);
								setPaypalError(null); // Clear error on success
								// Set value in parent form immediately? Or wait for final submit? Let's wait.
								setValue("method", { paypal: { billingKey: response.billingKey } }, { shouldValidate: true });
							} else {
								console.error("PayPal Success Response missing billingKey:", response);
								setPaypalError("페이팔 빌링키 발급 응답이 올바르지 않습니다.");
								setPaypalBillingKey(null);
							}
							// setIsPaypalUILoaded(false); // Keep UI loaded? Or close? Depends on PortOne behavior
						},
						onIssueBillingKeyFail: (error) => {
							console.error("PayPal Billing Key Issue Failed:", error);
							setPaypalError(`페이팔 연동 중 오류가 발생했습니다: ${error.message || "알 수 없는 오류"}`);
							setPaypalBillingKey(null); // Clear key on failure
							// setIsPaypalUILoaded(false); // Reset load state on failure?
						},
						// Optional: Add onCancel, onClose callbacks if needed
					},
				);
				console.log("PayPal UI load requested.");
				// Note: setIsPaypalUILoaded(true) was set earlier.
				// PortOne SDK handles the UI display. Actual success/failure comes via callbacks.
			} catch (error: unknown) {
				console.error("Error initiating PayPal UI load:", error);
				setPaypalError(`페이팔 UI 로드 중 오류 발생: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
				setIsPaypalUILoaded(false); // Reset load state on catch
			}
		}
	}, [isPaypalUILoaded, activeTab, subscriptionPaypalText, setValue]);

	// Load PayPal UI when the modal is open and the PayPal tab is active
	useEffect(() => {
		let cleanupPortOne: (() => void) | undefined;

		if (modals.payment && activeTab === "paypal") {
			loadPaypal();
			// Optional: If PortOne provides a cleanup function after loadIssueBillingKeyUI resolves, use it here.
			// Example: cleanupPortOne = response?.cleanup;
		}

		// Cleanup function for useEffect
		return () => {
			if (cleanupPortOne) {
				cleanupPortOne(); // Clean up PortOne UI if necessary
			}
			// Reset PayPal state if tab changes away from PayPal or modal closes
			// (Closing is handled by handleCloseModal, but this adds safety)
			if (activeTab !== "paypal") {
				setPaypalBillingKey(null);
				setPaypalError(null);
				// Reset the UI loaded state as well, so it reloads if the user comes back
				setIsPaypalUILoaded(false);
			}
		};
		// Ensure all dependencies that affect loading are included
	}, [modals.payment, activeTab, loadPaypal]);

	// 페이팔 결제 영역 렌더링
	const renderPaypalForm = () => (
		<div className="flex flex-col gap-4 mb-5">
			<p className="mb-2 text-sm text-gray-500">페이팔 계정으로 정기결제를 설정합니다.</p>
			{/* PortOne SDK will likely inject its UI here or manage it separately */}
			{/* We display status messages based on our state */}
			{!isPaypalUILoaded && <p>페이팔 연동 준비 중...</p>}
			<div className="portone-ui-container">
				<div className="p-4 rounded-md h-14 bg-hbc-gray-100 animate-pulse"></div>
			</div>
			{paypalError && <p className="mt-1 text-xs text-red-500">{paypalError}</p>}
			{paypalBillingKey && !paypalError && (
				<p className="mt-1 text-xs text-green-600">
					페이팔 연동이 완료되었습니다. &apos;결제하기&apos; 버튼을 클릭하여 구독을 완료하세요.
				</p>
			)}
			{!paypalBillingKey && !paypalError && isPaypalUILoaded && (
				<p className="mt-1 text-xs text-blue-600">페이팔 화면의 안내에 따라 결제를 진행해주세요.</p>
			)}
			{/* Placeholder for where PortOne might inject UI, if applicable */}
		</div>
	);

	// Determine if the main submit button should be disabled
	const isSubmitDisabled = useMemo(() => {
		if (isSubmitting) return true;
		if (activeTab === "easy") return true; // Easy pay is disabled
		if (activeTab === "paypal" && !paypalBillingKey) return true; // PayPal needs billing key
		// Card form validation is handled by RHF, but handleCardSubmit triggers it.
		// We don't disable based on card form errors here directly,
		// as the button click triggers validation.
		return false;
	}, [isSubmitting, activeTab, paypalBillingKey]);

	// Main submit button click handler
	const handleFinalSubmitClick = () => {
		if (activeTab === "card") {
			// Trigger validation and submission for card form
			handleCardSubmit(onSubmitCardInfo)(); // Note the extra () to invoke the handler
		} else if (activeTab === "paypal") {
			// PayPal billing key should already be set if button is enabled
			if (paypalBillingKey) {
				handleSubscribeConfirm();
			} else {
				// This case should ideally not happen if button is disabled correctly
				setPaypalError("페이팔 연동이 완료되지 않았습니다.");
			}
		} else if (activeTab === "easy") {
			alert("간편결제는 현재 지원되지 않습니다.");
		}
	};

	return (
		<Popup
			open={modals.payment}
			onOpenChange={handleOnOpenChange}
		>
			<PopupContent className="w-[600px] max-w-[600px]">
				<PopupHeader>
					<PopupTitle className="text-[26px] font-bold">결제 정보 입력</PopupTitle>
					<PopupDescription className="text-[16px] font-bold">
						선택하신 맴버십 플랜: <span className="text-hbc-black">{subscriptionPlanText}</span>
					</PopupDescription>
				</PopupHeader>

				<div className="flex flex-col items-start justify-start w-full gap-25px">
					<div className="w-full mb-4">
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
								<li>
									첫 결제 후 {recurringPeriod === RecurringPeriod.YEARLY ? "매년" : "매월"} 같은 날짜에 자동으로
									결제됩니다.
								</li>
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
								// onClick={() => setActiveTab("easy")}
								onClick={() => alert("간편결제 정기결제는 현재 지원되지 않습니다.")}
							>
								간편결제
							</button>
							<button
								type="button"
								className={cn(
									"px-4 py-2 text-sm font-medium",
									activeTab === "paypal"
										? "border-b-2 border-hbc-black text-hbc-black"
										: "text-gray-500 hover:text-gray-700 cursor-pointer",
								)}
								onClick={() => setActiveTab("paypal")}
							>
								페이팔
							</button>
						</div>

						{/* Render content based on active tab */}
						<div className="mt-4">
							{activeTab === "card" && renderCardForm()}
							{activeTab === "easy" && renderEasyPayOptions()}
							{activeTab === "paypal" && renderPaypalForm()} {/* Add PayPal form render */}
						</div>
					</div>
				</div>

				<PopupFooter className={cn("flex", isSubmitting && "opacity-50 pointer-events-none")}>
					<PopupButton
						intent="cancel"
						onClick={handleCloseModal} // Use centralized close handler
						disabled={isSubmitting}
					>
						취소
					</PopupButton>

					{/* Unified Submit Button */}
					<BasicPopupButton
						intent="confirm"
						className={cn("bg-hbc-red", isSubmitDisabled && "opacity-50 cursor-not-allowed")}
						onClick={handleFinalSubmitClick} // Use new handler
						disabled={isSubmitDisabled} // Use calculated disabled state
					>
						{isSubmitting ? "처리 중..." : "결제하기"}
					</BasicPopupButton>
				</PopupFooter>
			</PopupContent>
		</Popup>
	);
});

SubscribePaymentModal.displayName = "SubscribePaymentModal"; // Update display name consistency
