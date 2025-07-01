"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useCompletePaymentOrderMutation } from "@/apis/payment/mutations/useCompletePaymentOrderMutation";
import { Popup, PopupContent, PopupHeader, PopupTitle, PopupDescription, PopupButton } from "@/components/ui/Popup";
import { useDevice } from "@/hooks/use-device";

/**
 * PaymentCompletePage
 * 한 파일로 모바일/PC 모두 지원하는 결제 완료 처리 UI 컴포넌트입니다.
 * 라우트 파일(`apps/web/src/app/payment/complete/page.tsx`)에서 임포트하여 사용합니다.
 */
const PaymentCompletePage = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { isMobile } = useDevice();

	const paymentId = searchParams.get("paymentId");
	const code = searchParams.get("code");
	const message = searchParams.get("message");

	const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	// use mutation hook for completing payment to maintain consistent cache invalidation logic
	const { mutateAsync: completePayment } = useCompletePaymentOrderMutation();

	const handleClose = useCallback(() => {
		router.replace(isMobile ? "/mobile/my/orders" : "/orders");
	}, [router, isMobile]);

	useEffect(() => {
		if (code) {
			setStatus("error");
			setErrorMessage(message || "Payment failed.");
			return;
		}
		if (!paymentId) {
			setStatus("error");
			setErrorMessage("Invalid payment information.");
			return;
		}

		const verify = async () => {
			try {
				await completePayment({ paymentId });
				setStatus("success");
			} catch (err: any) {
				setStatus("error");
				setErrorMessage(err?.response?.data?.detail || err?.message || "Payment verification failed.");
			}
		};

		void verify();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const descriptionCls = (extra?: string) =>
		`${isMobile ? "text-8px" : "text-12px"} font-semibold leading-150% text-center ${extra ?? ""}`;

	const buttonCls = isMobile ? "w-full h-22px text-12px" : "w-full h-30px text-14px";

	return (
		<Popup
			open
			onOpenChange={handleClose}
			variant={isMobile ? "mobile" : "default"}
		>
			<PopupContent
				className={isMobile ? "w-[238px] flex flex-col bg-[#DADADA]" : "w-[350px] flex flex-col bg-[#DADADA]"}
			>
				{status === "processing" && (
					<div className="flex flex-col items-center justify-center gap-3 py-10">
						<svg
							aria-hidden="true"
							className="w-8 h-8 text-hbc-white animate-spin fill-hbc-black"
							viewBox="0 0 100 101"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
								fill="currentColor"
							/>
							<path
								d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
								fill="currentFill"
							/>
						</svg>
						<span className={isMobile ? "text-12px" : "text-14px"}>결제 상태를 확인 중입니다...</span>
					</div>
				)}

				{status === "success" && (
					<div className="flex flex-col gap-4 py-10">
						<PopupHeader>
							<PopupTitle className={isMobile ? "text-[12px]" : "text-[14px]"}>결제가 완료되었습니다</PopupTitle>
						</PopupHeader>
						<PopupDescription className={descriptionCls()}>
							결제가 성공적으로 처리되었습니다. 주문 내역 페이지에서 자세한 정보를 확인하실 수 있습니다.
						</PopupDescription>
						<PopupButton
							onClick={handleClose}
							className={buttonCls}
						>
							확인
						</PopupButton>
					</div>
				)}

				{status === "error" && (
					<div className="flex flex-col gap-4 py-10">
						<PopupHeader>
							<PopupTitle className={isMobile ? "text-[12px]" : "text-[14px]"}>결제 처리 중 오류</PopupTitle>
						</PopupHeader>
						<PopupDescription className={descriptionCls("whitespace-pre-line")}>{errorMessage}</PopupDescription>
						<PopupButton
							onClick={handleClose}
							className={buttonCls}
						>
							닫기
						</PopupButton>
					</div>
				)}
			</PopupContent>
		</Popup>
	);
};

export default PaymentCompletePage;
