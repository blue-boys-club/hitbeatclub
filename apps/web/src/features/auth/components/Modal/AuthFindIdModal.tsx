import { Popup, PopupContent, PopupDescription, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import { Toast, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/Toast/toast";
import { PopupButton } from "@/components/ui/PopupButton";
import { useState } from "react";

interface AuthFindIdModalProps {
	isOpen: boolean;
	onCloseModal: () => void;
}
export const AuthFindIdModal = ({ isOpen, onCloseModal }: AuthFindIdModalProps) => {
	const [isToastOpen, setIsToastOpen] = useState(false);

	const onCopyEmail = async () => {
		const emailInput = document.getElementById("popup-email") as HTMLInputElement;
		if (emailInput?.value) {
			try {
				await navigator.clipboard.writeText(emailInput.value);
				setIsToastOpen(true);
			} catch (err) {
				console.error("Failed to copy text: ", err);
			}
		}
		setIsToastOpen(true);
	};

	return (
		<ToastProvider>
			<Popup
				open={isOpen}
				onOpenChange={onCloseModal}
			>
				<PopupContent>
					<PopupHeader>
						<PopupTitle className="text-[26px] font-bold">아이디 찾기</PopupTitle>
					</PopupHeader>

					<PopupDescription>
						<div className="text-center">이메일</div>
					</PopupDescription>

					<PopupFooter>
						<PopupButton
							onClick={onCopyEmail}
							className="py-2.5 font-bold"
						>
							복사하기
						</PopupButton>
					</PopupFooter>

					<Toast
						open={isToastOpen}
						onOpenChange={setIsToastOpen}
					>
						<ToastTitle>이메일이 복사되었습니다.</ToastTitle>
					</Toast>
					<ToastViewport />
				</PopupContent>
			</Popup>
		</ToastProvider>
	);
};
