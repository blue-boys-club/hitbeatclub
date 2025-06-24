import { Popup, PopupContent, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import { PopupButton } from "@/components/ui/PopupButton";
import { useToast } from "@/hooks/use-toast";

interface AuthFindIdModalProps {
	isOpen: boolean;
	onCloseModal: () => void;
	email: string;
}
export const AuthFindIdModal = ({ isOpen, onCloseModal, email }: AuthFindIdModalProps) => {
	const { toast } = useToast();

	const onCopyEmail = async () => {
		if (email) {
			try {
				await navigator.clipboard.writeText(email);
				toast({
					title: "이메일이 복사되었습니다.",
				});
			} catch (err) {
				console.error("이메일 복사에 실패했습니다. ", err);
			}
		}
	};

	return (
		<Popup
			open={isOpen}
			onOpenChange={onCloseModal}
		>
			<PopupContent>
				<PopupHeader>
					<PopupTitle className="text-[26px] font-bold">이메일 찾기</PopupTitle>
				</PopupHeader>

				<div className="text-center">{email}</div>

				<PopupFooter>
					<PopupButton
						onClick={onCopyEmail}
						className="py-2.5 font-bold"
					>
						복사하기
					</PopupButton>
				</PopupFooter>
			</PopupContent>
		</Popup>
	);
};
