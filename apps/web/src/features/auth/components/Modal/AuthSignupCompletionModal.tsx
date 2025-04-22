import { Popup, PopupContent, PopupDescription, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import { PopupButton } from "@/components/ui/PopupButton";

interface AuthSignupCompletionModalProps {
	isPopupOpen: boolean;
	onClosePopup: () => void;
}

export const AuthSignupCompletionModal = ({ isPopupOpen, onClosePopup }: AuthSignupCompletionModalProps) => {
	return (
		<Popup
			open={isPopupOpen}
			onOpenChange={onClosePopup}
		>
			<PopupContent>
				<PopupHeader>
					<PopupTitle className="font-extrabold">🥳 회원가입 완료</PopupTitle>
				</PopupHeader>

				<PopupDescription className="font-bold">
					🎉 환영합니다! <br />
					지금 멤버십을 가입하고
					<br /> 0% 수수료, 무제한 업로드 등의 혜택을 누리세요
				</PopupDescription>

				<PopupFooter>
					<PopupButton className="py-2.5 font-bold">둘러보기</PopupButton>
					<PopupButton className="py-2.5 font-bold bg-hbc-red">멤버십 가입하기</PopupButton>
				</PopupFooter>
			</PopupContent>
		</Popup>
	);
};
