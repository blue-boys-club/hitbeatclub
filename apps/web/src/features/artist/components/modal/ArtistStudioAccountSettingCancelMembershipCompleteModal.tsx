import { Button } from "@/components/ui/Button";
import { Popup, PopupContent, PopupDescription, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";

interface ArtistStudioAccountSettingCancelMembershipCompleteModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export const ArtistStudioAccountSettingCancelMembershipCompleteModal = ({
	isOpen,
	onClose,
}: ArtistStudioAccountSettingCancelMembershipCompleteModalProps) => {
	return (
		<Popup
			open={isOpen}
			onOpenChange={onClose}
		>
			<PopupContent>
				<PopupHeader className="mb-6">
					<PopupTitle className="font-bold">멤버십 해지가 완료되었습니다!</PopupTitle>
				</PopupHeader>

				<PopupDescription>
					<div className="flex flex-col gap-4 text-[16px] font-bold leading-[32px] tracking-0.16px">
						<div>
							히트비트클럽은 멤버십 해지 후 3개월간 회원님의 트랙, 판매 정보, 정산 데이터를 안전하게 보관합니다.
							<br />
							이후에는 모든 정보가 자동 삭제되며 복구가 불가능하니,
							<br />
							멤버십 재가입을 원하실 경우 3개월 이내에 가입을 완료해 주세요.
						</div>

						<div className="flex flex-col gap-2">
							<div>
								⏰ 삭제 예정일: <span className="text-hbc-red">2025년 8월 30일</span>
							</div>
							<div>📌 재가입 시 모든 데이터가 복원됩니다.</div>
						</div>
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

ArtistStudioAccountSettingCancelMembershipCompleteModal.displayName =
	"ArtistStudioAccountSettingCancelMembershipCompleteModal";
