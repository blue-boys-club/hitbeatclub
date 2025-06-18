"use client";

import { Popup, PopupContent, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import { memo } from "react";

interface UnsubscribeModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export const UnsubscribeModal = memo(({ isOpen, onClose }: UnsubscribeModalProps) => {
	return (
		<Popup
			open={isOpen}
			onOpenChange={onClose}
			variant="mobile"
		>
			<PopupContent className="w-[238px] flex flex-col bg-[#DADADA]">
				<div className="flex flex-col gap-3">
					<span className="text-[12px] leading-100% font-bold text-center">구독을 취소하고 싶으신가요?</span>
					<div className="flex flex-col gap-3">
						<div className="font-semibold text-8px leading-160%">
							구독을 취소하시면, 지금까지의 멤버쉽 혜택이 사라져요.
							<br />
							그래도 취소하시겠어요?
						</div>
						<button className="w-full bg-black rounded-30px h-22px text-white font-semibold text-12px leading-100%">
							결제하기
						</button>
					</div>
				</div>
			</PopupContent>
		</Popup>
	);
});

UnsubscribeModal.displayName = "UnsubscribeModal";
