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
import { useSubscription } from "../../hooks/useSubscription"; // Assuming this hook provides modal controls
import { RecurringPeriod } from "../../schema";

interface SubscribePaymentChoiceModalProps {
	onClose: () => void;
	onSelectTossCard: () => void;
	onSelectPaypal: () => void;
	isOpen: boolean;
	recurringPeriod: RecurringPeriod;
	promotionCode?: string | null;
}

/**
 * 결제 수단 선택 모달
 */
export const SubscribePaymentChoiceModal = memo(
	({
		isOpen,
		onClose,
		onSelectTossCard,
		onSelectPaypal,
		recurringPeriod,
		promotionCode,
	}: SubscribePaymentChoiceModalProps) => {
		const handleOnOpenChange = (open: boolean) => {
			if (!open) {
				onClose();
			}
		};

		const subscriptionPlanText = useMemo(
			() => (recurringPeriod === RecurringPeriod.YEARLY ? "연간 멤버십 (189,900원 결제)" : "월간 멤버십 (24,990원/월)"),
			[recurringPeriod],
		);

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
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<button
									onClick={onSelectTossCard}
									className="flex flex-col items-center justify-center p-6 text-lg font-semibold text-white transition-colors bg-blue-500 rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
								>
									<span>💳</span>
									<span className="mt-2">카드 결제</span>
									<span className="mt-1 text-xs font-normal">(토스페이먼츠)</span>
								</button>
								<button
									onClick={onSelectPaypal}
									className="flex flex-col items-center justify-center p-6 text-lg font-semibold text-white transition-colors bg-sky-500 rounded-lg shadow hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
								>
									<span>
										<img
											src="/assets/images/paypal-mark.png"
											alt="PayPal"
											className="w-6 h-6"
										/>
									</span>
									<span className="mt-2">페이팔</span>
								</button>
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
