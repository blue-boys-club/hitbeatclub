"use client";

import { Popup, PopupContent, PopupDescription, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import { PopupButton } from "@/components/ui/PopupButton";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { useAuthStore } from "@/stores/auth";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

interface AuthSignupCompletionModalProps {
	isPopupOpen: boolean;
	onClosePopup: () => void;
}

export const AuthSignupCompletionModal = ({ isPopupOpen, onClosePopup }: AuthSignupCompletionModalProps) => {
	const { data: user } = useQuery({
		...getUserMeQueryOption(),
		enabled: isPopupOpen,
	});

	const { setPhoneNumber } = useAuthStore(useShallow((state) => ({ setPhoneNumber: state.setPhoneNumber })));

	useEffect(() => {
		if (user) {
			setPhoneNumber(user.phoneNumber);
		}
	}, [user]);

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
					<PopupButton className="py-2.5 font-bold">
						<Link href="/">둘러보기</Link>
					</PopupButton>
					<PopupButton className="py-2.5 font-bold bg-hbc-red">
						<Link href="/subscribe">멤버십 가입하기</Link>
					</PopupButton>
				</PopupFooter>
			</PopupContent>
		</Popup>
	);
};
