"use client";

import { Checkbox } from "@/components/ui";
import { Popup, PopupContent, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import { memo } from "react";

interface MembershipInformationModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export const MembershipInformationModal = memo(({ isOpen, onClose }: MembershipInformationModalProps) => {
	return (
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
							<span className="font-semibold text-8px leading-140%">히트비트클럽 멤버쉽 연간 결제</span>
							<span className="font-semibold text-8px leading-140%">240,000 KRW</span>
						</div>
						<div className="flex flex-col gap-2px">
							<span className="font-extrabold text-10px leading-160%">결제 정보</span>
							<span className="font-semibold text-8px leading-140%">
								김일상
								<br />
								00000
								<br />
								서울특별시 종로구 자하문로7길 13 서울특별시 종로구
								<br />
								자하문로7길 13
							</span>
						</div>
						<div className="font-semibold text-8px leading-160%">
							결제를 진행하는 결제 정보로 매월 (또는 매년) 자동
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
						<button className="w-full bg-black rounded-30px h-22px text-white font-semibold text-12px leading-100%">
							결제하기
						</button>
					</div>
				</div>
			</PopupContent>
		</Popup>
	);
});

MembershipInformationModal.displayName = "MembershipInformationModal";
