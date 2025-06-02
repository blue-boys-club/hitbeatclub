import { Popup, PopupContent, PopupDescription, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import { Toast, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/Toast/toast";
import { PopupButton } from "@/components/ui/PopupButton";
import { useState } from "react";
import { Input } from "@/components/ui";

interface AuthFindIdModalProps {
	isOpen: boolean;
	onCloseModal: () => void;
	email: string;
}

export const AuthFindIdModal = ({ isOpen, onCloseModal, email }: AuthFindIdModalProps) => {
	const [isToastOpen, setIsToastOpen] = useState(false);

	const onCopyEmail = async () => {
		try {
			await navigator.clipboard.writeText(email);
			setIsToastOpen(true);
		} catch (err) {
			console.error("Failed to copy text: ", err);
		}
	};

	return (
		<ToastProvider>
			<Popup
				open={isOpen}
				onOpenChange={onCloseModal}
			>
				<PopupContent>
					<PopupHeader>
						<PopupTitle className="text-[26px] font-bold">이메일 찾기</PopupTitle>
					</PopupHeader>

					<PopupDescription className="flex flex-col items-center">
						<span className="flex flex-col items-start">
							<span className="font-suit font-bold text-base leading-[160%] tracking-[-0.02em]">이메일 주소</span>
							<Input
								id="popup-email"
								type="text"
								value={email}
								readOnly
								className="w-[301px] px-3 py-2 text-center border rounded-md border-hbc-black bg-gray-50"
							/>
						</span>
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
