import { PopupButton } from "@/components/ui/PopupButton";
import { Popup, PopupContent, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import Link from "next/link";

interface AuthResetPasswordCompletionModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export const AuthResetPasswordCompletionModal = ({ isOpen, onClose }: AuthResetPasswordCompletionModalProps) => {
	return (
		<Popup
			open={isOpen}
			onOpenChange={onClose}
		>
			<PopupContent>
				<PopupHeader>
					<PopupTitle className="text-2xl font-extrabold tracking-[0.26px]">설정이 완료되었습니다!</PopupTitle>
				</PopupHeader>

				<PopupFooter>
					<Link href="/auth/login">
						<PopupButton className="py-2.5 font-bold">확인</PopupButton>
					</Link>
				</PopupFooter>
			</PopupContent>
		</Popup>
	);
};
