import { Button } from "@/components/ui/Button";
import { Popup, PopupContent, PopupDescription, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";

interface ArtistStudioAccountSettingPlanChangeCancelModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export const ArtistStudioAccountSettingPlanChangeCancelModal = ({
	isOpen,
	onClose,
	onConfirm,
}: ArtistStudioAccountSettingPlanChangeCancelModalProps) => {
	return (
		<Popup
			open={isOpen}
			onOpenChange={onClose}
		>
			<PopupContent>
				<PopupHeader className="mb-6">
					<PopupTitle className="font-bold">정말 취소하시겠어요?</PopupTitle>
				</PopupHeader>

				<PopupDescription>
					<div className="flex flex-col gap-6 text-[16px] font-bold leading-[25.6px] -tracking-0.32px">
						<div>
							연간 멤버십 전환 예약을 취소하면,
							<br />
							다음 결제일부터도 월간 구독(₩24,990)이 유지됩니다.
							<br /> 더 많은 혜택과 할인은 연간 멤버십에서만 가능해요!
						</div>
						<div className="text-center">※ 전환 예약은 언제든 다시 설정할 수 있어요.</div>
					</div>
				</PopupDescription>

				<PopupFooter className="flex gap-5">
					<Button
						rounded="full"
						className="flex-1"
						onClick={onClose}
					>
						유지
					</Button>
					<Button
						rounded="full"
						className="flex-1 bg-hbc-red hover:bg-hbc-red/80"
						onClick={onConfirm}
					>
						취소
					</Button>
				</PopupFooter>
			</PopupContent>
		</Popup>
	);
};

ArtistStudioAccountSettingPlanChangeCancelModal.displayName = "ArtistStudioAccountSettingPlanChangeCancelModal";
