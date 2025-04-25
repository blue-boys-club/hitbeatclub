import { Button } from "@/components/ui/Button";
import { Popup, PopupContent, PopupDescription, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";

interface ArtistStudioAccountSettingCancelMembershipModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export const ArtistStudioAccountSettingCancelMembershipModal = ({
	isOpen,
	onClose,
	onConfirm,
}: ArtistStudioAccountSettingCancelMembershipModalProps) => {
	return (
		<Popup
			open={isOpen}
			onOpenChange={onClose}
		>
			<PopupContent>
				<PopupHeader className="mb-6">
					<PopupTitle className="font-bold">멤버십 해지 신청</PopupTitle>
				</PopupHeader>

				<PopupDescription>
					<div className="flex flex-col gap-5">
						<div className="text-[16px] font-bold leading-[25.6px] -tracking-0.32px flex flex-col gap-4">
							<div>
								<div>🔔 멤버십 해지 전, 꼭 확인해주세요</div>
								멤버십을 해지하면 업로드한 트랙들이 모두 비공개 처리되며, 판매 중인 상품도 즉시 판매 종료됩니다.
								<br /> 정산이 진행 중인 금액은 보류되거나 지급 제한될 수 있어요.
								<br /> 3개월 이내에 재구독하지 않으면 트랙 및 판매 이력이 완전히 삭제됩니다.
							</div>
							<div>
								<div>💸 환불 안내</div>
								월간 구독은 서비스 특성상 해지 후 환불이 불가합니다.
								<br /> 연간 구독은 약관에 따라 남은 기간과 위약금 차감 후 부분 환불이 가능하며, 자세한 내용은{" "}
								<span className="underline cursor-pointer">이용약관</span>을 참고해주세요.
							</div>
						</div>

						<div className="text-[16px] font-bold leading-[24px] tracking-0.16px">정말 멤버십을 해지하시겠어요?</div>
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
						className="flex-1 bg-hbc-red hover:bg-hbc-red/80"
						onClick={onConfirm}
					>
						😭해지 진행하기
					</Button>
				</PopupFooter>
			</PopupContent>
		</Popup>
	);
};

ArtistStudioAccountSettingCancelMembershipModal.displayName = "ArtistStudioAccountSettingCancelMembershipModal";
