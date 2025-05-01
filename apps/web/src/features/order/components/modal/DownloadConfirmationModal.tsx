import { cn } from "@/common/utils";
import * as Popup from "@/components/ui/Popup";
import { useState } from "react";
import { ArtistContactModal } from "./ArtistContactModal";
import { ContactLink } from "../../types";
import { PopupButton } from "@/components/ui";

interface DownloadConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirmDownload: () => void;
	links: ContactLink[];
}

/**
 * 음원 다운로드 전 확인 사항을 안내하고, 아티스트 연락처 모달을 포함할 수 있는 모달 컴포넌트입니다.
 */
export const DownloadConfirmationModal = ({
	isOpen,
	onClose,
	onConfirmDownload,
	links,
}: DownloadConfirmationModalProps) => {
	const [isContactModalOpen, setIsContactModalOpen] = useState(false);

	const handleMainModalClose = () => {
		setIsContactModalOpen(false);
		onClose();
	};

	return (
		<>
			<Popup.Popup
				open={isOpen}
				onOpenChange={(open) => !open && handleMainModalClose()}
			>
				<Popup.PopupContent className={cn("w-full max-w-[608px]")}>
					<Popup.PopupHeader>
						<Popup.PopupTitle className="font-extrabold font-suit">✅ 파일 다운로드 전 안내</Popup.PopupTitle>
					</Popup.PopupHeader>

					{/* Main content area */}
					<div className="flex flex-col items-center self-stretch overflow-hidden gap-13px p-12px">
						<p className="font-bold text-center text-20px leading-32px tracking-02px text-hbc-black font-suit">
							📂 다운로드 전 꼭 확인해주세요!
						</p>
						<div className="self-stretch text-neutral-600 font-suit">
							<p className="text-15px font-bold leading-150% tracking-0.15px">
								해당 음원은 히트비트클럽이 직접 제작하거나 판매하는 콘텐츠가 아닙니다. 구매자가 직접 선택한 판매자와의
								거래로, <br />
								다운로드 후 발생하는 이슈(파일 오류, 누락, 설명과 다른 콘텐츠 등)는
								<br />➤ 판매자와 <span className="font-extrabold">직접</span> 소통해 해결해주셔야 합니다.
								<br />
								<br />
								히트비트클럽은 창작자 간의 자유로운 거래를 위한 플랫폼입니다.
								<br />
								환불, 교환, 수정 요청 등과 같은 개별 거래 이슈에 대해서는
								<br />
								플랫폼이 직접 개입하거나 보장해드리기 어렵습니다
								<br />
								<br />
								📌 판매자와의 연락처는 [판매자 연락처 보기] 버튼을 통해 확인하실 수 있습니다.
							</p>
						</div>
						<div className="self-stretch text-neutral-600 font-suit">
							<p className="text-15px font-bold leading-150% tracking-0.15px">
								※ 구매 후 발생한 문제는 판매자와의 협의를 권장드리며,
								<br />
								히트비트클럽 고객센터는 시스템상의 오류 발생 시에만 대응이 가능합니다.
							</p>
						</div>
					</div>

					<Popup.PopupFooter className="flex items-center justify-center gap-6">
						{/* Contact Button - Opens the embedded contact modal */}
						<PopupButton
							className="px-12px py-5px text-15px leading-150% tracking-0.15px font-bold text-hbc-white"
							onClick={() => setIsContactModalOpen(true)}
						>
							📞 판매자 연락처 보기
						</PopupButton>
						{/* Download Button */}
						<Popup.PopupButton
							className="px-12px py-5px text-15px leading-150% tracking-0.15px font-bold text-hbc-white"
							onClick={onConfirmDownload}
						>
							⬇️ 다운로드 진행
						</Popup.PopupButton>
					</Popup.PopupFooter>
				</Popup.PopupContent>
			</Popup.Popup>

			<ArtistContactModal
				isOpen={isContactModalOpen}
				onClose={() => setIsContactModalOpen(false)}
				links={links}
			/>
		</>
	);
};
