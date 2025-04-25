import { Button } from "@/components/ui/Button";
import { Popup, PopupContent, PopupDescription, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";

interface ArtistStudioAccountSettingPlanChangeCompleteModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export const ArtistStudioAccountSettingPlanChangeCompleteModal = ({
	isOpen,
	onClose,
}: ArtistStudioAccountSettingPlanChangeCompleteModalProps) => {
	return (
		<Popup
			open={isOpen}
			onOpenChange={onClose}
		>
			<PopupContent>
				<PopupHeader className="mb-6">
					<PopupTitle className="font-bold">🎉 전환 예약이 완료되었어요!</PopupTitle>
				</PopupHeader>

				<PopupDescription>
					<div className="flex flex-col gap-4 text-[16px] font-bold leading-[25.6px] -tracking-0.32px">
						<div>
							다음 결제일부터 연간 구독(₩ 239,880)이 자동 적용됩니다. <br />
							지금처럼 계속 멤버 혜택을 누리면서,
							<br />더 많은 리워드와 기능을 만나보세요!
						</div>
						<div>결제일 이전까지 언제든지 [멤버십 정보]에서 변경할 수 있어요.</div>
					</div>
				</PopupDescription>

				<PopupFooter>
					<Button
						rounded="full"
						className="w-full"
						onClick={onClose}
					>
						확인
					</Button>
				</PopupFooter>
			</PopupContent>
		</Popup>
	);
};

ArtistStudioAccountSettingPlanChangeCompleteModal.displayName = "ArtistStudioAccountSettingPlanChangeCompleteModal";
