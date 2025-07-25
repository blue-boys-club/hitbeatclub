"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Popup, PopupContent, PopupFooter, PopupHeader, PopupTitle, PopupButton } from "@/components/ui/Popup";
import { useFormContext } from "react-hook-form";
import PortOne from "@portone/browser-sdk/v2";
import { useSubscription } from "../../hooks/useSubscription";
import { PORTONE_CHANNEL_KEY, PORTONE_STORE_ID } from "../../../../lib/payment.constant";
import { SubscribeFormValue } from "../../schema";
import { v4 as uuidv4 } from "uuid";

interface SubscribePaypalModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: (billingKey: string) => void;
	onError: (errorMessage?: string) => void; // Allow passing a message to the generic error modal
}

/**
 * 페이팔 빌링키 발급 모달
 */
export const SubscribePaypalModal = memo(({ isOpen, onClose, onSuccess, onError }: SubscribePaypalModalProps) => {
	const { watch, setValue } = useFormContext<SubscribeFormValue>();
	const subscriptionPlan = watch("subscriptionPlan");
	const { isSubmitting: isParentSubmitting } = useSubscription(); // Renamed to avoid conflict

	const [paypalBillingKey, setPaypalBillingKey] = useState<string | null>(null); // Keep for internal state if needed before onSuccess
	const [paypalError, setPaypalError] = useState<string | null>(null);
	const [uiStatus, setUiStatus] = useState<"idle" | "loadingUI" | "waitingForUser" | "processingCallback" | "error">(
		"idle",
	);

	const subscriptionIssueName = useMemo(
		() => (subscriptionPlan === "YEAR" ? "HITBEAT 연간 멤버십" : "HITBEAT 월간 멤버십"),
		[subscriptionPlan],
	);

	const loadPaypalUI = useCallback(async () => {
		if (typeof window === "undefined" || !isOpen || uiStatus !== "idle") return;

		setUiStatus("loadingUI");
		setPaypalError(null);
		setPaypalBillingKey(null); // Reset billing key on new attempt

		try {
			console.log("PortOne.loadIssueBillingKeyUI for PayPal: Attempting to load...");
			await PortOne.loadIssueBillingKeyUI(
				{
					uiType: "PAYPAL_RT",
					storeId: PORTONE_STORE_ID,
					issueName: subscriptionIssueName,
					billingKeyMethod: "PAYPAL",
					channelKey: PORTONE_CHANNEL_KEY.PAYPAL,
					issueId: `paypal-issue-${uuidv4()}`, // Optional: for better tracking
				},
				{
					onIssueBillingKeySuccess: (response) => {
						console.log("PortOne.loadIssueBillingKeyUI PayPal Success:", response);
						setUiStatus("processingCallback");
						if (response.billingKey) {
							setPaypalBillingKey(response.billingKey); // Set for a moment if needed
							setValue("method", { type: "PAYPAL", billingKey: response.billingKey }, { shouldValidate: true });
							setPaypalError(null);
							onSuccess(response.billingKey); // Auto-proceed on success
						} else {
							console.error("PayPal Success Response missing billingKey:", response);
							const errMsg = "페이팔 정보 연동 응답이 올바르지 않습니다.";
							setPaypalError(errMsg);
							setUiStatus("error");
							onError(errMsg);
						}
					},
					onIssueBillingKeyFail: (error) => {
						console.error("PortOne.loadIssueBillingKeyUI PayPal Fail:", error);
						setUiStatus("processingCallback"); // Callback received
						const errMsg = error.message || "페이팔 연동 중 오류가 발생했습니다.";
						setPaypalError(errMsg);
						setUiStatus("error");
						onError(errMsg);
					},
				},
			);
			// After calling loadIssueBillingKeyUI, PortOne should render its button.
			// We transition state to let user know they need to interact with PortOne's UI.
			setUiStatus("waitingForUser");
			console.log(
				"PortOne.loadIssueBillingKeyUI for PayPal: UI load requested, waiting for user interaction with PortOne's button.",
			);
		} catch (error: unknown) {
			console.error("Error initiating PayPal UI load (outer catch):", error);
			const errMsg = error instanceof Error ? error.message : "페이팔 UI 로드 중 알 수 없는 오류 발생";
			setPaypalError(errMsg);
			setUiStatus("error");
			onError(errMsg);
		}
	}, [isOpen, uiStatus, subscriptionIssueName, setValue, onSuccess, onError]);

	useEffect(() => {
		if (isOpen && uiStatus === "idle") {
			// Automatically trigger when modal opens and is idle
			loadPaypalUI();
		}
		// Reset state when modal closes, unless it's already processing a callback that will close it
		if (!isOpen && uiStatus !== "processingCallback") {
			setUiStatus("idle");
			setPaypalError(null);
			setPaypalBillingKey(null);
		}
	}, [isOpen, uiStatus, loadPaypalUI]);

	const handleOnOpenChange = (open: boolean) => {
		if (!open) {
			onClose();
		}
	};

	const handleRetryLoadUI = () => {
		setUiStatus("idle"); // This will trigger loadPaypalUI in useEffect
	};

	return (
		<Popup
			open={isOpen}
			onOpenChange={handleOnOpenChange}
		>
			<PopupContent className="w-[500px] max-w-[500px]">
				<PopupHeader>
					<PopupTitle className="text-[22px] font-bold">페이팔로 결제</PopupTitle>
				</PopupHeader>

				<div className="my-6">
					{(uiStatus === "loadingUI" || uiStatus === "idle") && (
						<div className="flex flex-col items-center justify-center p-4 my-4 text-center rounded-md bg-gray-50 min-h-[150px]">
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
							<p className="text-sm text-gray-500">잠시 후 이 곳에 페이팔 버튼이 표시됩니다.</p>
						</div>
					)}

					{/* This div is where PortOne SDK injects the PayPal button. It needs to be visible. */}
					<div
						id="portone-paypal-ui-container"
						className="portone-ui-container min-h-[100px] my-4 flex flex-col justify-center items-center"
						style={{
							display:
								uiStatus === "waitingForUser" || (uiStatus === "error" && !paypalError?.includes("UI 로드"))
									? "flex"
									: "none",
						}}
					>
						{/* Content here will be REPLACED by PortOne's PayPal button if successful injection */}
						{/* If PortOne fails to inject, this placeholder text might be visible if container is shown. */}
						{uiStatus === "waitingForUser" && (
							<p className="text-center text-gray-700">버튼을 클릭하여 페이팔 결제를 진행해주세요.</p>
						)}
					</div>

					{uiStatus === "error" && paypalError && (
						<div className="p-3 my-2 text-sm text-red-700 bg-red-100 border border-red-400 rounded">
							<p className="font-semibold">오류 발생:</p>
							<p>{paypalError}</p>
						</div>
					)}

					{uiStatus === "processingCallback" && (
						<div className="flex flex-col items-center justify-center p-4 my-4 text-center rounded-md bg-gray-50 min-h-[150px]">
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
							<p className="font-semibold">페이팔 응답을 처리 중입니다...</p>
						</div>
					)}
				</div>

				<PopupFooter>
					<PopupButton
						intent="cancel"
						onClick={onClose}
						disabled={isParentSubmitting || uiStatus === "loadingUI" || uiStatus === "processingCallback"}
					>
						취소
					</PopupButton>
					{/* Removed explicit confirm button as success is now automatic */}
					{/* Retry button can be useful if UI load fails */}
					{uiStatus === "error" && (
						<PopupButton
							intent="confirm"
							onClick={handleRetryLoadUI}
							disabled={isParentSubmitting} // Simplified: uiStatus is already "error" here
							className="bg-blue-500 hover:bg-blue-600"
						>
							페이팔 다시 시도
						</PopupButton>
					)}
				</PopupFooter>
			</PopupContent>
		</Popup>
	);
});

SubscribePaypalModal.displayName = "SubscribePaypalModal";
