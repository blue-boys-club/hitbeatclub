import { memo } from "react";
import { Popup, PopupButton, PopupContent, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import { useSubscription } from "../../hooks/useSubscription";

/**
 * 오류 표시 모달 컴포넌트
 */
export const ErrorModal = memo(() => {
	const { modals, closeModal } = useSubscription();

	const handleOnOpenChange = (open: boolean) => {
		if (!open) {
			closeModal("error");
		}
	};

	return (
		<Popup
			open={modals.error}
			onOpenChange={handleOnOpenChange}
		>
			<PopupContent className="w-[589px] max-w-[589px]">
				<PopupHeader>
					<PopupTitle className="text-[26px] font-bold">❌ 오류가 발생했습니다</PopupTitle>
				</PopupHeader>

				<div className="flex flex-col items-center justify-center form-group gap-25px">
					<div className="flex flex-col items-start justify-start gap-25px w-415px">
						<span className="self-stretch font-bold text-center text-16px leading-32px tracking-016px">
							결제 처리 중 오류가 발생했습니다.
							<br />
							잠시 후 다시 시도해주세요.
						</span>

						<span className="self-stretch font-bold text-center text-16px leading-32px tracking-016px text-hbc-red">
							문제가 계속되면 고객센터로 문의해주세요.
						</span>
					</div>
				</div>

				<PopupFooter>
					<PopupButton
						intent="confirm"
						className="bg-hbc-red"
						onClick={() => closeModal("error")}
					>
						확인
					</PopupButton>
				</PopupFooter>
			</PopupContent>
		</Popup>
	);
});

ErrorModal.displayName = "ErrorModal";
