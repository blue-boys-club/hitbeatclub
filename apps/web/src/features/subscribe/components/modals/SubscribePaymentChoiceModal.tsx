import { memo, useMemo } from "react";
import {
	Popup,
	PopupContent,
	PopupFooter,
	PopupHeader,
	PopupTitle,
	PopupButton,
	PopupDescription,
} from "@/components/ui/Popup";
import { RecurringPeriod } from "../../schema";
import Image from "next/image";
/**
 * `SubscribePaymentChoiceModal` 컴포넌트의 Props 정의
 */
interface SubscribePaymentChoiceModalProps {
	/** 모달 닫기 콜백 함수 */
	onClose: () => void;
	/** 카드 결제 선택 콜백 함수 */
	onSelectCard: () => void;
	/** 토스페이 결제 선택 콜백 함수 */
	onSelectToss: () => void;
	/** 페이팔 결제 선택 콜백 함수 */
	onSelectPaypal: () => void;
	/** 모달의 열림 상태 */
	isOpen: boolean;
	/** 현재 선택된 구독 주기 (연간/월간) */
	recurringPeriod: RecurringPeriod;
	/** 적용된 프로모션 코드 (선택 사항) */
	promotionCode?: string | null;
	/** 카드 결제 처리 중 상태 (선택 사항) */
	isInitiatingCard?: boolean;
	/** 토스페이 결제 처리 중 상태 (선택 사항) */
	isInitiatingToss?: boolean;
}

/**
 * 결제 수단 선택 모달 컴포넌트입니다.
 * 사용자에게 다양한 결제 옵션(카드, 토스페이, 페이팔 등)을 제공하고 선택을 처리합니다.
 */
export const SubscribePaymentChoiceModal = memo(
	({
		isOpen,
		onClose,
		onSelectCard,
		onSelectToss,
		onSelectPaypal,
		recurringPeriod,
		promotionCode,
		isInitiatingCard,
		isInitiatingToss,
	}: SubscribePaymentChoiceModalProps) => {
		/**
		 * 모달의 열림/닫힘 상태 변경 시 호출되는 핸들러입니다.
		 * @param open 새로운 열림 상태
		 */
		const handleOnOpenChange = (open: boolean) => {
			if (!open) {
				onClose();
			}
		};

		/** 구독 플랜에 대한 설명 텍스트 (예: "연간 멤버십 (189,900원 결제)") */
		const subscriptionPlanText = useMemo(() => {
			const yearlyPrice = "189,900원";
			const monthlyPrice = "24,990원/월";
			return recurringPeriod === RecurringPeriod.YEARLY
				? `연간 멤버십 (${yearlyPrice} 결제)`
				: `월간 멤버십 (${monthlyPrice})`;
		}, [recurringPeriod]);

		return (
			<Popup
				open={isOpen}
				onOpenChange={handleOnOpenChange}
			>
				<PopupContent className="w-[550px] max-w-[550px]">
					<PopupHeader>
						<PopupTitle className="text-[22px] font-bold">결제 수단 선택</PopupTitle>
						<PopupDescription className="mt-2 text-sm text-gray-600">
							선택하신 플랜: <span className="font-semibold text-black">{subscriptionPlanText}</span>
						</PopupDescription>
					</PopupHeader>

					<div className="my-6 space-y-6">
						{promotionCode && (
							<div className="p-3 rounded-md bg-blue-50">
								<span className="font-bold text-blue-700">적용된 프로모션 코드: {promotionCode}</span>
							</div>
						)}

						<div className="p-4 bg-gray-100 rounded-md">
							<h3 className="mb-2 text-base font-semibold text-gray-800">💳 정기 결제 안내</h3>
							<ul className="ml-5 space-y-1 text-sm text-gray-700 list-disc">
								<li>선택하신 결제수단으로 정기 결제가 이루어집니다.</li>
								<li>
									첫 결제 후 {recurringPeriod === RecurringPeriod.YEARLY ? "매년" : "매월"} 같은 날짜에 자동으로
									결제됩니다.
								</li>
								<li>결제 정보는 안전하게 암호화되어 관리됩니다.</li>
								<li>언제든지 멤버십을 취소할 수 있습니다.</li>
							</ul>
						</div>

						<div>
							<p className="mb-3 text-center text-gray-600">정기결제를 위한 결제 수단을 선택해주세요.</p>
							{/* First row for Card and PayPal */}
							<div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2">
								<button
									onClick={onSelectCard}
									className="flex flex-col cursor-pointer items-center justify-center p-6 text-lg font-semibold text-white transition-colors bg-blue-500 rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
									disabled={isInitiatingCard || isInitiatingToss}
								>
									<span>💳</span>
									<span className="mt-2">{isInitiatingCard ? "처리중..." : "카드 결제"}</span>
								</button>
								<button
									onClick={onSelectPaypal}
									className="flex flex-col cursor-pointer items-center justify-center p-6 text-lg font-semibold text-white transition-colors bg-sky-500 rounded-lg shadow hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 disabled:opacity-50"
									disabled={isInitiatingCard || isInitiatingToss}
								>
									<span>
										<Image
											src="/assets/paypal-logo.png"
											alt="PayPal"
											width={24}
											height={24}
											className="w-6 h-6"
										/>
									</span>
									<span className="mt-2">페이팔</span>
								</button>
							</div>

							{/* Second row for Easy Payments (Toss Pay for now) */}
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
								<button
									onClick={onSelectToss}
									className="flex flex-col cursor-pointer items-center justify-center p-6 text-lg font-semibold transition-colors rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 sm:col-start-1 disabled:opacity-50"
									disabled={isInitiatingToss || isInitiatingCard}
								>
									<Image
										src="/assets/toss-logo.png"
										alt="Toss"
										width={24}
										height={24}
										className="w-6 h-6"
									/>
									<span className="mt-2">{isInitiatingToss ? "처리중..." : "토스페이"}</span>
								</button>
								{/* Future easy payment methods will go here */}
							</div>
						</div>
					</div>

					<PopupFooter>
						<PopupButton
							intent="cancel"
							onClick={onClose}
						>
							취소
						</PopupButton>
					</PopupFooter>
				</PopupContent>
			</Popup>
		);
	},
);

SubscribePaymentChoiceModal.displayName = "SubscribePaymentChoiceModal";
