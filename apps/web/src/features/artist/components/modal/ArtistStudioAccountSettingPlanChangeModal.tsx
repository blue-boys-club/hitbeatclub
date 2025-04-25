import { Button } from "@/components/ui/Button";
import { Popup, PopupContent, PopupDescription, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";

interface ArtistStudioAccountSettingPlanChangeModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export const ArtistStudioAccountSettingPlanChangeModal = ({
	isOpen,
	onClose,
	onConfirm,
}: ArtistStudioAccountSettingPlanChangeModalProps) => {
	return (
		<Popup
			open={isOpen}
			onOpenChange={onClose}
		>
			<PopupContent>
				<PopupHeader className="mb-6">
					<PopupTitle className="font-bold">요금제 전환 예약</PopupTitle>
				</PopupHeader>

				<PopupDescription>
					<div className="flex flex-col gap-4 text-[16px] font-bold leading-[25.6px] -tracking-0.32px">
						<div>🔔 멤버십 요금제 변경 전 확인해 주세요</div>
						<div>🎉 연간 구독 전환 예약</div>
						<div>
							현재 이용 중인 월간 구독은 다음 결제일까지만 유지되며, 그 이후에는 연간 요금제(₩ 239,880)로 자동
							전환됩니다.
							<br /> 연간 요금제로 전환 시 20% 할인 혜택을 누릴 수 있어요 :)
						</div>
						<div>
							※ 전환은 다음 결제일에 자동으로 적용되며, <br />
							변경을 원하시면 결제일 이전에 구독 설정에서 취소할 수 있습니다.
						</div>
					</div>
				</PopupDescription>

				<PopupFooter className="flex gap-5">
					<Button
						rounded="full"
						className="flex-1"
						onClick={onConfirm}
					>
						예약
					</Button>
					<Button
						rounded="full"
						className="flex-1 bg-hbc-red hover:bg-hbc-red/80"
						onClick={onClose}
					>
						취소
					</Button>
				</PopupFooter>
			</PopupContent>
		</Popup>
	);
};

ArtistStudioAccountSettingPlanChangeModal.displayName = "ArtistStudioAccountSettingPlanChangeModal";
