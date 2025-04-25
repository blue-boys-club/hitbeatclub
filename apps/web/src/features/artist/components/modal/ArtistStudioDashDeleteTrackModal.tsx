import {
	Popup,
	PopupButton,
	PopupContent,
	PopupDescription,
	PopupFooter,
	PopupHeader,
	PopupTitle,
} from "@/components/ui/Popup";

interface ArtistStudioDashDeleteTrackModalProps {
	isModalOpen: boolean;
	onClose: () => void;
}

const ArtistStudioDashDeleteTrackModal = ({ isModalOpen, onClose }: ArtistStudioDashDeleteTrackModalProps) => {
	return (
		<Popup
			open={isModalOpen}
			onOpenChange={onClose}
		>
			<PopupContent className="max-w-[311px]">
				<PopupHeader>
					<PopupTitle>트랙 삭제하기</PopupTitle>
					<PopupDescription>
						<div className="text-center">
							등록된 트랙 정보가 삭제 됩니다.
							<br />
							정말로 삭제 하시겠습니까?
						</div>
					</PopupDescription>
				</PopupHeader>
				<PopupFooter>
					<PopupButton>확인</PopupButton>
					<PopupButton>취소</PopupButton>
				</PopupFooter>
			</PopupContent>
		</Popup>
	);
};

export default ArtistStudioDashDeleteTrackModal;
