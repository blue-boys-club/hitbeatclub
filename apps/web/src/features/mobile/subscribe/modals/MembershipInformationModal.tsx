"use client";

import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { Checkbox } from "@/components/ui";
import { Popup, PopupContent } from "@/components/ui/Popup";
import { useQuery } from "@tanstack/react-query";
import { memo, useState, useCallback } from "react";
import {
	useSubscription,
	type BaseBillingKeyIssueArgs,
	type AugmentedSubscribeFormValues,
} from "@/features/subscribe/hooks/useSubscription";
import { formatPrice } from "@/common/utils";
import { SubscribePaymentMethodModal } from "./SubscribePaymentMethodModal";
import { SubscribeSuccessModal } from "./SubscribeSuccessModal";
import { SubscribeErrorModal } from "./SubscribeErrorModal";

interface MembershipInformationModalProps {
	isOpen: boolean;
	onClose: () => void;
	plan: "YEAR" | "MONTH";
}

export const MembershipInformationModal = memo(({ isOpen, onClose, plan }: MembershipInformationModalProps) => {
	const { data: user } = useQuery(getUserMeQueryOption());
	const {
		subscribePlans,
		isLoadingSubscribePlans,
		initiateBillingKeyIssue,
		submitSubscription,
		isSubmitting,
		isProcessingPayment,
	} = useSubscription();
	const [isMethodModalOpen, setIsMethodModalOpen] = useState(false);

	const amount = (() => {
		if (isLoadingSubscribePlans || !subscribePlans) return plan === "YEAR" ? 240000 : 25000;
		const planData = subscribePlans[plan];
		return planData?.discountPrice ?? planData?.price ?? (plan === "YEAR" ? 240000 : 25000);
	})();

	const openPaymentModal = () => setIsMethodModalOpen(true);

	return (
		<>
			<Popup
				open={isOpen}
				onOpenChange={onClose}
				variant="mobile"
			>
				<PopupContent className="w-[238px] flex flex-col bg-[#DADADA]">
					<div className="flex flex-col gap-3">
						<span className="text-[12px] leading-100% font-bold text-center">멤버쉽 가입정보</span>
						<div className="flex flex-col gap-3">
							<div className="flex flex-col gap-2px">
								<span className="font-extrabold text-10px leading-160%">구독 정보</span>
								<span className="font-semibold text-8px leading-140%">
									히트비트클럽 멤버쉽 {plan === "YEAR" ? "연간" : "월간"} 결제
								</span>
								<span className="font-semibold text-8px leading-140%">{formatPrice(amount)}</span>
							</div>
							<div className="flex flex-col gap-2px">
								<span className="font-extrabold text-10px leading-160%">결제 정보</span>
								<span className="font-semibold text-8px leading-140%">
									{user?.name || "사용자"}
									<br />
									{user?.phoneNumber || "전화번호 없음"}
									<br />
									{user?.region || "지역 정보 없음"}
									<br />
									{user?.country === "KR" ? "대한민국" : user?.country || "국가 정보 없음"}
								</span>
							</div>
							<div className="font-semibold text-8px leading-160%">
								결제를 진행하는 결제 정보로 {plan === "YEAR" ? "매년" : "매월"} 자동
								<br />
								결제되오니, 이점 확인 후 진행 부탁드립니다.
								<br />
								이후 결제수단 변경은 프로필 {">"} 계정설정 페이지에서
								<br />
								변경 가능합니다.
							</div>
							<div className="flex gap-1 items-start">
								<Checkbox
									wrapperClassName="border border-black rounded-2px transform translate-y-1px"
									size="small"
								/>
								<span className="font-semibold text-8px leading-150%">
									유의사항을 확인하였으며, 판매자 이용약관에 동의합니다.
								</span>
							</div>
							<button
								className="w-full bg-black rounded-30px h-22px text-white font-semibold text-12px leading-100% disabled:opacity-60"
								onClick={openPaymentModal}
								disabled={isLoadingSubscribePlans}
							>
								결제하기
							</button>
						</div>
					</div>
					{isMethodModalOpen && (
						<SubscribePaymentMethodModal
							isOpen={isMethodModalOpen}
							onClose={setIsMethodModalOpen as any}
							plan={plan}
							amount={amount}
						/>
					)}
				</PopupContent>
			</Popup>
			{/* Global subscription result modals */}
			<SubscribeSuccessModal />
			<SubscribeErrorModal />
		</>
	);
});

MembershipInformationModal.displayName = "MembershipInformationModal";
