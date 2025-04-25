import { memo } from "react";
import Link from "next/link";
import { Popup, PopupContent, PopupFooter } from "@/components/ui/Popup";
import { useSubscription } from "../../hooks/useSubscription";
import { cn } from "@/common/utils/tailwind";

/**
 * 멤버십 가입 성공 모달 컴포넌트
 */
export const SuccessModal = memo(() => {
	const { modals, closeModal } = useSubscription();

	const handleOnOpenChange = (open: boolean) => {
		if (!open) {
			closeModal("success");
		}
	};

	return (
		<Popup
			open={modals.success}
			onOpenChange={handleOnOpenChange}
		>
			<PopupContent className="w-[589px] max-w-[589px] flex flex-col justify-start items-center gap-25px">
				<div className="self-stretch font-extrabold leading-loose text-center tracking-026px text-hbc-black text-26px font-suit">
					🎉 히트비트클럽 멤버가 되신 걸 환영합니다!
				</div>

				<div className="flex flex-col items-center justify-center w-full gap-25px">
					<div className="flex flex-col items-start justify-start h-16 gap-10px">
						<div className="flex flex-col items-start justify-start gap-20px">
							<div className="self-stretch font-bold leading-loose text-center tracking-016px text-16px text-hbc-black font-suit">
								ROAD TO THE HITMAKER <br />
								지금부터 당신의 사운드는 진짜 무기가 됩니다.
							</div>
						</div>
					</div>

					<div className="flex flex-col items-start justify-start gap-5 w-415px">
						<div className="self-stretch font-bold leading-loose tracking-016px text-16px text-hbc-black font-suit">
							📦 멤버십 정보
							<br />
							이용 플랜 히트비트멤버십 (월간 / 연간)
							<br />
							결제 금액 ₩18,900 / ₩189,900
							<br />
							다음 결제일 YYYY.MM.DD
						</div>
					</div>

					<div className="flex flex-col items-start justify-start gap-5 w-415px">
						<div className="self-stretch">
							<span className="font-bold leading-loose tracking-016px text-16px text-hbc-black font-suit">
								🎁 적용된 혜택
								<br />
							</span>
							<span className="font-bold leading-loose tracking-016px text-16px text-hbc-black font-suit">
								✅ HITCODE 3개월 무료 혜택 적용
								<br />✅ 수수료 할인 혜택 활성화
							</span>
						</div>
					</div>
				</div>
				<PopupFooter>
					<Link
						href="/artist-studio"
						className="px-2.5 py-[5px] bg-red-600 rounded-[20px] inline-flex justify-center items-center gap-2.5"
						onClick={() => {
							closeModal("success");
						}}
					>
						<div className="font-bold leading-none text-center text-18px tracking-018px text-hbc-white font-suit">
							아티스트스튜디오로 이동
						</div>
					</Link>
				</PopupFooter>
			</PopupContent>
		</Popup>
	);
});

SuccessModal.displayName = "SuccessModal";
