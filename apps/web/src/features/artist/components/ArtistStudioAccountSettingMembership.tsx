import { useState } from "react";
import { ArrowRight } from "@/assets/svgs";
import { cn } from "@/common/utils";
import { Button } from "@/components/ui/Button";
import { ArtistStudioAccountSettingCancelMembershipModal } from "./modal/ArtistStudioAccountSettingCancelMembershipModal";
import { ArtistStudioAccountSettingCancelMembershipConfirmModal } from "./modal/ArtistStudioAccountSettingCancelMembershipConfirmModal";
import { ArtistStudioAccountSettingCancelMembershipCompleteModal } from "./modal/ArtistStudioAccountSettingCancelMembershipCompleteModal";
import { ArtistStudioAccountSettingPlanChangeModal } from "./modal/ArtistStudioAccountSettingPlanChangeModal";
import { ArtistStudioAccountSettingPlanChangeCompleteModal } from "./modal/ArtistStudioAccountSettingPlanChangeCompleteModal";
import { ArtistStudioAccountSettingPlanChangeCancelModal } from "./modal/ArtistStudioAccountSettingPlanChangeCancelModal";
import { useShallow } from "zustand/react/shallow";
import { useLayoutStore } from "@/stores/layout";

export const ArtistStudioAccountSettingMembership = () => {
	// const [isMembership, setIsMembership] = useState(true);
	const { isMembership, setMembership } = useLayoutStore(
		useShallow((state) => ({
			isMembership: state.isMembership,
			setMembership: state.setMembership,
		})),
	);
	const [isExpired, setIsExpired] = useState(true);

	// 요금제 전환 관련 상태
	const [isPlanChangeModalOpen, setIsPlanChangeModalOpen] = useState(false);
	const [isPlanChangeCompleteModalOpen, setIsPlanChangeCompleteModalOpen] = useState(false);
	const [isPlanChangeCancelModalOpen, setIsPlanChangeCancelModalOpen] = useState(false);
	const [isPlanChangeReserved, setIsPlanChangeReserved] = useState(false);

	// 멤버십 해지 관련 상태
	const [isMembershipCancelModalOpen, setIsMembershipCancelModalOpen] = useState(false);
	const [isMembershipCancelConfirmModalOpen, setIsMembershipCancelConfirmModalOpen] = useState(false);
	const [isMembershipCancelCompleteModalOpen, setIsMembershipCancelCompleteModalOpen] = useState(false);

	const onCancelMembership = () => {
		setIsMembershipCancelModalOpen(false);
		setIsMembershipCancelConfirmModalOpen(true);
	};

	const onConfirmCancellation = () => {
		setIsMembershipCancelConfirmModalOpen(false);
		// TODO: 멤버십 해지 API 호출
		setIsMembershipCancelCompleteModalOpen(true);
	};

	const onCloseCompleteModal = () => {
		setIsMembershipCancelCompleteModalOpen(false);
		// TODO: 페이지 새로고침 또는 상태 업데이트
	};

	const handlePlanChangeClick = () => {
		if (isPlanChangeReserved) {
			setIsPlanChangeCancelModalOpen(true);
		} else {
			setIsPlanChangeModalOpen(true);
		}
	};

	const onConfirmPlanChange = () => {
		setIsPlanChangeModalOpen(false);
		// TODO: 요금제 전환 예약 API 호출
		setIsPlanChangeReserved(true);
		setIsPlanChangeCompleteModalOpen(true);
	};

	const onConfirmPlanChangeCancel = () => {
		setIsPlanChangeCancelModalOpen(false);
		// TODO: 요금제 전환 예약 취소 API 호출
		setIsPlanChangeReserved(false);
	};

	return (
		<div className="w-[737px] flex flex-col gap-10">
			<div className="flex flex-col gap-[5px]">
				<div className="text-[22px] font-bold leading-[26.4px] tracking-0.22px">나의 멤버십정보</div>
				<div className="flex items-center justify-between gap-1">
					<div className="text-[16px] text-hbc-red font-bold leading-[19.2px] tracking-0.16px">
						연간 요금제를 이용 중입니다.
					</div>
					<div
						className={cn(
							"inline-flex items-center text-[12px] font-bold leading-[14.4px] tracking-0.12px cursor-pointer border-b",
							isMembership ? "text-hbc-gray-300 border-hbc-gray-300" : "text-hbc-blue leading-[18px] border-hbc-blue",
						)}
					>
						{isMembership ? "현재 멤버십 혜택 보러가기" : "다시 가입하기"}
						<ArrowRight />
					</div>
				</div>

				<div className="text-[16px] font-bold leading-[19.2px] tracking-0.16px">
					{isExpired ? "2025년 01월 27일 다음번 요금이 청구됩니다." : "2025년 01월 27일 이후 멤버십 혜택이 사라집니다."}
				</div>

				<div className="flex justify-end text-[12px] leading-[18px] tracking-0.12px">
					✅ 히트 코드 적용! 3개월 무료 혜택이 반영되었습니다.
				</div>
			</div>

			<div className="flex flex-col gap-[15px]">
				<div className="text-[22px] font-bold leading-[26.4px] tracking-0.22px">멤버십 결제 수단 변경</div>
				<div className="flex items-center justify-between gap-1">
					<div className="font-bold leading-tight tracking-tight text-black ">멤버십 정기 결제 수단</div>
					<Button
						variant="outline"
						className="w-[120px] text-[12px]"
					>
						결제 수단 선택
					</Button>
				</div>
			</div>

			<div className="flex flex-col gap-[15px]">
				<div className="text-[22px] font-bold leading-[26.4px] tracking-0.22px">멤버십 변경 / 해지</div>
				<div className="flex items-center justify-between gap-1">
					<div className="flex items-center gap-2.5">
						<div className="text-black font-bold leading-[19.2px] tracking-0.16px">멤버십 요금제 전환</div>
						<div className="text-hbc-red text-[12px] font-bold leading-[14.4px] tracking-0.12px">
							연간 결제 전환 시, 20% 할인된 가격으로 사용하실 수 있습니다.
						</div>
					</div>

					<Button
						variant="outline"
						className="w-[120px] text-[12px]"
						onClick={handlePlanChangeClick}
					>
						{isPlanChangeReserved ? "요금제 전환 취소" : "요금제 전환"}
					</Button>
				</div>
			</div>

			<div
				className="flex justify-end text-[12px] text-hbc-gray-300 font-bold leading-[14.4px] tracking-0.22px underline cursor-pointer"
				onClick={() => setIsMembershipCancelModalOpen(true)}
			>
				멤버십 해지
			</div>

			{/* 요금제 전환 관련 모달 */}
			<ArtistStudioAccountSettingPlanChangeModal
				isOpen={isPlanChangeModalOpen}
				onClose={() => setIsPlanChangeModalOpen(false)}
				onConfirm={onConfirmPlanChange}
			/>

			<ArtistStudioAccountSettingPlanChangeCompleteModal
				isOpen={isPlanChangeCompleteModalOpen}
				onClose={() => setIsPlanChangeCompleteModalOpen(false)}
			/>

			<ArtistStudioAccountSettingPlanChangeCancelModal
				isOpen={isPlanChangeCancelModalOpen}
				onClose={() => setIsPlanChangeCancelModalOpen(false)}
				onConfirm={onConfirmPlanChangeCancel}
			/>

			{/* 멤버십 해지 관련 모달 */}
			<ArtistStudioAccountSettingCancelMembershipModal
				isOpen={isMembershipCancelModalOpen}
				onClose={() => setIsMembershipCancelModalOpen(false)}
				onConfirm={onCancelMembership}
			/>

			<ArtistStudioAccountSettingCancelMembershipConfirmModal
				isOpen={isMembershipCancelConfirmModalOpen}
				onClose={() => setIsMembershipCancelConfirmModalOpen(false)}
				onConfirm={onConfirmCancellation}
			/>

			<ArtistStudioAccountSettingCancelMembershipCompleteModal
				isOpen={isMembershipCancelCompleteModalOpen}
				onClose={onCloseCompleteModal}
			/>
		</div>
	);
};

ArtistStudioAccountSettingMembership.displayName = "ArtistStudioAccountSettingMembership";
