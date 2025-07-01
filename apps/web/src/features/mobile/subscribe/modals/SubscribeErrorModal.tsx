"use client";

import { Popup, PopupContent, PopupHeader, PopupTitle, PopupFooter } from "@/components/ui/Popup";
import { useSubscription } from "@/features/subscribe/hooks/useSubscription";
import { memo } from "react";

interface SubscribeErrorModalProps {
	message?: string | null;
}

/**
 * Mobile subscribe error modal
 */
export const SubscribeErrorModal = memo(({ message }: SubscribeErrorModalProps) => {
	const { modals, closeModal } = useSubscription();

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			closeModal("error");
		}
	};

	return (
		<Popup
			open={modals.error}
			onOpenChange={handleOpenChange}
			variant="mobile"
		>
			<PopupContent className="w-[238px] flex flex-col bg-[#DADADA] items-center gap-3 p-4">
				<PopupHeader>
					<PopupTitle className="text-[12px] font-bold leading-100%">❌ Subscription Failed</PopupTitle>
				</PopupHeader>
				<p className="text-[10px] leading-140% text-center font-medium">
					{message || "An error occurred while processing your subscription. Please try again."}
				</p>
				<PopupFooter>
					<button
						className="px-4 py-1 bg-black text-white rounded-30px text-[12px] font-semibold leading-100%"
						onClick={() => closeModal("error")}
					>
						OK
					</button>
				</PopupFooter>
			</PopupContent>
		</Popup>
	);
});

SubscribeErrorModal.displayName = "SubscribeErrorModal";
