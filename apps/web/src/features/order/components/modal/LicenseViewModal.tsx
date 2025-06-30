"use client";

import * as Popup from "@/components/ui/Popup";
import { LICENSE_MAP_TEMPLATE } from "@/apis/product/product.dummy";
import { cn } from "@/common/utils";

interface LicenseViewModalProps {
	/** 모달 열림 여부 */
	isOpen: boolean;
	/** 모달 닫기 핸들러 */
	onClose: () => void;
	/** 라이센스 타입 */
	licenseType: string;
}

/**
 * 라이센스 상세 정보를 보여주는 모달 컴포넌트입니다.
 *
 * 실데이터 연동 전이라 가격 등은 표시하지 않고,
 * `LICENSE_MAP_TEMPLATE` 의 정적 데이터를 기반으로 렌더링합니다.
 */
export const LicenseViewModal = ({ isOpen, onClose, licenseType }: LicenseViewModalProps) => {
	// 템플릿에서 라이센스 정보 조회 (대소문자 보호)
	const licenseInfo = LICENSE_MAP_TEMPLATE[licenseType?.toUpperCase() as keyof typeof LICENSE_MAP_TEMPLATE];

	if (!licenseInfo) return null;

	return (
		<Popup.Popup
			open={isOpen}
			onOpenChange={onClose}
		>
			<Popup.PopupContent className="w-[500px] max-w-[500px]">
				<Popup.PopupHeader>
					<Popup.PopupTitle className="font-bold">{licenseInfo.name} License</Popup.PopupTitle>
				</Popup.PopupHeader>

				<div className="flex flex-col items-center justify-center gap-25px w-full">
					<div className="self-stretch p-12px rounded-[5px] flex flex-col justify-start items-center gap-[10px] overflow-hidden">
						<div className="font-bold leading-160% text-black text-16px font-suit -tracking-032px text-center">
							{licenseInfo.name} 라이센스 사용범위
						</div>
						<div className="flex flex-col items-center justify-center gap-10px">
							{licenseInfo.notes?.map((note, index) => (
								<div
									key={index}
									className={cn(
										"text-[12px] font-bold font-suit leading-150% tracking-012px text-center",
										typeof note === "object" && note.color ? note.color : "text-hbc-gray-400",
									)}
								>
									{typeof note === "string" ? note : note.text}
								</div>
							))}
						</div>
					</div>
				</div>

				<Popup.PopupFooter>
					<Popup.PopupButton onClick={onClose}>닫기</Popup.PopupButton>
				</Popup.PopupFooter>
			</Popup.PopupContent>
		</Popup.Popup>
	);
};

LicenseViewModal.displayName = "LicenseViewModal";
