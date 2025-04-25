import { memo, useState } from "react";
import { Popup, PopupContent, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import Link from "next/link";
import { useSubscription } from "../../hooks/useSubscription";

/**
 * 멤버십 정보 보관 안내 모달 컴포넌트
 */
export const InformationModal = memo(() => {
	const { modals, closeModal } = useSubscription();
	const [doNotShowForWeek, setDoNotShowForWeek] = useState(false);
	// 삭제 예정일은 실제 구현에서는 API로부터 가져오거나 계산되어야 함
	const deletionDate = "2025년 8월 30일";

	const handleOnOpenChange = (open: boolean) => {
		if (!open) {
			closeModal("information");

			// 일주일간 보지 않기가 체크되었다면 로컬 스토리지에 저장
			if (doNotShowForWeek) {
				const expiryDate = new Date();
				expiryDate.setDate(expiryDate.getDate() + 7);
				localStorage.setItem("hideInformationModalUntil", expiryDate.toISOString());
			}
		}
	};

	const handleCheckboxChange = () => {
		setDoNotShowForWeek(!doNotShowForWeek);
	};

	return (
		<Popup
			open={modals.information || false}
			onOpenChange={handleOnOpenChange}
		>
			<PopupContent className="w-[589px] max-w-[589px]">
				<PopupHeader>
					<PopupTitle className="text-2xl font-extrabold text-center">🔔 멤버십 정보 보관 안내</PopupTitle>
				</PopupHeader>

				<div className="flex flex-col items-center justify-center w-full">
					<div className="flex flex-col items-center justify-start gap-6 p-2 w-[415px]">
						<div className="flex flex-col items-start justify-start gap-5 w-96">
							<div className="self-stretch justify-start text-base font-bold leading-loose tracking-tight text-black font-suit">
								히트비트클럽은 멤버십 해지 후 3개월간 회원님의 트랙, 판매 정보, 정산 데이터를 안전하게 보관합니다.
								이후에는 모든 정보가 자동 삭제되며 복구가 불가능하니, 멤버십 재가입을 원하실 경우 3개월 이내에 가입을
								완료해 주세요.
							</div>
						</div>

						<div className="flex flex-col items-start justify-start gap-5 w-96">
							<div className="self-stretch justify-start">
								<span className="text-base font-bold leading-loose tracking-tight text-black">⏰ 삭제 예정일: </span>
								<span className="text-base font-bold leading-loose tracking-tight text-red-600">{deletionDate}</span>
								<br />
								<span className="text-base font-bold leading-loose tracking-tight text-black">
									📌 재가입 시 모든 데이터가 복원됩니다.
								</span>
							</div>
						</div>

						<div
							className="inline-flex items-center justify-start gap-2 cursor-pointer w-96"
							onClick={handleCheckboxChange}
						>
							<div className={`w-3 h-3 rounded-sm border border-black ${doNotShowForWeek ? "bg-black" : "bg-white"}`} />
							<div className="justify-start text-base font-bold leading-relaxed text-black font-suit">
								일주일간 보지 않기
							</div>
						</div>
					</div>
				</div>

				<PopupFooter>
					<Link
						className="px-2.5 py-[5px] bg-red-600 rounded-[20px] inline-flex justify-center items-center gap-2.5"
						href="/membership"
					>
						<div className="justify-start text-lg font-bold leading-none tracking-tight text-center text-white font-suit">
							멤버십 페이지로 이동
						</div>
					</Link>
				</PopupFooter>
			</PopupContent>
		</Popup>
	);
});

InformationModal.displayName = "InformationModal";
