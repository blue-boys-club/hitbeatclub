import { CheckboxCircle } from "@/assets/svgs";
import { Button } from "@/components/ui/Button";
import { Popup, PopupContent, PopupDescription, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import { useState } from "react";
import { cn } from "@/common/utils";

interface ArtistStudioAccountSettingCancelMembershipConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export const ArtistStudioAccountSettingCancelMembershipConfirmModal = ({
	isOpen,
	onClose,
	onConfirm,
}: ArtistStudioAccountSettingCancelMembershipConfirmModalProps) => {
	return (
		<Popup
			open={isOpen}
			onOpenChange={onClose}
		>
			<PopupContent>
				<PopupHeader className="mb-6">
					<PopupTitle className="font-bold">🔔 멤버십 해지 전, 꼭 확인해주세요!</PopupTitle>
				</PopupHeader>

				<PopupDescription>
					<div className="flex flex-col gap-5">
						<div className="text-[16px] font-bold leading-[25.6px] -tracking-0.32px">
							<div>🧾 멤버십 환불 안내</div>
							히트비트클럽의 멤버십 구독은 창작 도구 및 콘텐츠 이용을 위한 유료 서비스입니다.
							<br /> 월간 멤버십(24,990원)은 결제 즉시 서비스가 개시되며, 환불이 불가합니다.
							<br /> 연간 멤버십(239,880원)은 결제일로부터 3개월 이내에만 환불 가능하며, 3개월 초과 시 환불은
							불가합니다.
							<br /> 위약금 20%가 적용되며, 1일이라도 사용 시 1개월로 산정됩니다.
						</div>

						<div className="flex flex-col gap-2 font-bold leading-[25.6px] -tracking-0.32px">
							<div className={cn("flex items-center gap-2 cursor-pointer")}>
								<CheckboxCircle />
								[환불 정책]에 동의합니다.
							</div>
							<div className={cn("flex items-center gap-2 cursor-pointer")}>
								<CheckboxCircle />
								[정산정책]에 동의합니다.
							</div>
							<div className={cn("flex items-center gap-2 cursor-pointer")}>
								<CheckboxCircle />
								[서비스 이용약관] 및 [개인정보처리방침] 동의합니다.
							</div>
						</div>
					</div>
				</PopupDescription>

				<PopupFooter className="flex gap-2">
					<Button
						rounded="full"
						className="flex-1"
						onClick={onClose}
					>
						🙇🏻‍♂️멤버십 유지하기
					</Button>
					<Button
						rounded="full"
						className={"flex-1 bg-hbc-red hover:bg-hbc-red/80"}
						onClick={onConfirm}
					>
						😭해지 완료
					</Button>
				</PopupFooter>
			</PopupContent>
		</Popup>
	);
};

ArtistStudioAccountSettingCancelMembershipConfirmModal.displayName =
	"ArtistStudioAccountSettingCancelMembershipConfirmModal";
