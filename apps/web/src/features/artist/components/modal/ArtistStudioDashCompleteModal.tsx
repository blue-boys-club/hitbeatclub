import {
	Popup,
	PopupButton,
	PopupContent,
	PopupDescription,
	PopupFooter,
	PopupHeader,
	PopupTitle,
} from "@/components/ui/Popup";

interface ArtistStudioDashCompleteModalProps {
	isModalOpen: boolean;
	onClose: () => void;
}

const ArtistStudioDashCompleteModal = ({ isModalOpen, onClose }: ArtistStudioDashCompleteModalProps) => {
	return (
		<Popup
			open={isModalOpen}
			onOpenChange={onClose}
		>
			<PopupContent className="max-w-[346px]">
				<PopupHeader>
					<PopupTitle>수정이 완료되었습니다!</PopupTitle>
					<PopupDescription>
						<span className="text-center">트랙 수정이 완료 되었습니다.</span>
					</PopupDescription>
				</PopupHeader>
				<PopupFooter>
					<PopupButton>My Studio 이동</PopupButton>
				</PopupFooter>
			</PopupContent>
		</Popup>
	);
};

export default ArtistStudioDashCompleteModal;
