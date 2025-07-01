"use client";

import { Popup, PopupContent, PopupHeader, PopupTitle, PopupFooter } from "@/components/ui/Popup";
import { useSubscription } from "@/features/subscribe/hooks/useSubscription";
import { useRouter, usePathname } from "next/navigation";
import { memo } from "react";

/**
 * Mobile subscribe success modal
 */
export const SubscribeSuccessModal = memo(() => {
	const { modals, closeModal } = useSubscription();
	const router = useRouter();
	const pathname = usePathname();

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			closeModal("success");
		}
	};

	const handleConfirm = () => {
		closeModal("success");
		// callback page path patterns
		const isCallbackPage = pathname?.includes("/subscribe/callback");
		if (isCallbackPage) {
			router.replace("/mobile/subscribe");
		}
	};

	return (
		<Popup
			open={modals.success}
			onOpenChange={handleOpenChange}
			variant="mobile"
		>
			<PopupContent className="w-[238px] flex flex-col bg-[#DADADA] items-center gap-3 p-4">
				<PopupHeader>
					<PopupTitle className="text-[12px] font-bold leading-100%">
						히트비트클럽 멤버가 되신 걸 환영합니다!
					</PopupTitle>
				</PopupHeader>
				<p className="text-[10px] leading-140% text-center font-medium">
					ROAD TO THE HITMAKER
					<br />
					지금부터 당신의 사운드는 진짜 무기가 됩니다.
				</p>
				<PopupFooter>
					<button
						className="px-4 py-1 bg-black text-white rounded-30px text-[12px] font-semibold leading-100%"
						onClick={handleConfirm}
					>
						확인
					</button>
				</PopupFooter>
			</PopupContent>
		</Popup>
	);
});

SubscribeSuccessModal.displayName = "SubscribeSuccessModal";
