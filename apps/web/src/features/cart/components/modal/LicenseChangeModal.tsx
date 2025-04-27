"use client";

import * as Popup from "@/components/ui/Popup";
import { useState } from "react";
import { cn } from "@/common/utils";

interface LicenseChangeModalProps {
	isOpen: boolean;
	onClose: () => void;
	licenses?: LicenseOption[];
	currentLicenseId: LicenseOption["id"]; // TODO: fix this
	currentItemId: number;
	onChangeLicense: (id: number, license: LicenseOption["id"]) => void;
}

// TODO: fix this
type LicenseOption = {
	id: "exclusive" | "master";
	name: string;
	description: string;
	price: number;
	benefits?: string[];
};

const licenseOptions: LicenseOption[] = [
	{
		id: "exclusive",
		name: "Exclusive",
		description: "MP3, WAV, Stems",
		price: 150000,
		benefits: [
			"무제한 뮤직비디오 제작 가능",
			"상업적 라이브 공연에서 자유롭게 사용 가능",
			"라디오 방송 권한 (무제한 방송국 포함)",
			"온라인 오디오 스트리밍 무제한 가능",
			"음원 복제 및 유통 수량 제한 없음",
			"음악 녹음 및 발매용 사용 가능",
			"상업적 이용 가능",
			"저작권 표기 필수",
		],
	},
	{
		id: "master",
		name: "Master",
		description: "MP3, WAV, Stems",
		price: 200000,
		benefits: [
			"무제한 뮤직비디오 제작 가능",
			"상업적 라이브 공연에서 자유롭게 사용 가능",
			"라디오 방송 권한 (무제한 방송국 포함)",
			"온라인 오디오 스트리밍 무제한 가능",
			"음원 복제 및 유통 수량 제한 없음",
			"음악 녹음 및 발매용 사용 가능",
			"상업적 이용 가능",
			"저작권 표기 필수",
		],
	},
];

export const LicenseChangeModal = ({
	isOpen,
	onClose,
	licenses = licenseOptions,
	currentLicenseId,
	currentItemId,
	onChangeLicense,
}: LicenseChangeModalProps) => {
	const [selectedLicense, setSelectedLicense] = useState<LicenseOption["id"]>(currentLicenseId);

	const handleChangeLicense = () => {
		if (selectedLicense === currentLicenseId) {
			onClose();
			return;
		}

		onChangeLicense(currentItemId, selectedLicense);
		onClose();
	};

	const selectedOption = licenses.find((option) => option.id === selectedLicense);

	return (
		<Popup.Popup
			open={isOpen}
			onOpenChange={onClose}
		>
			<Popup.PopupContent className="w-[500px] max-w-[500px]">
				<Popup.PopupHeader>
					<Popup.PopupTitle className="font-bold">라이센스 선택</Popup.PopupTitle>
				</Popup.PopupHeader>

				<div className="flex flex-col items-center justify-start w-full gap-25px">
					<div className="flex items-start justify-start gap-4">
						{licenses.map((option) => (
							<div
								key={option.id}
								className={cn(
									"p-12px rounded-lg outline-2 outline-offset-[-2px] outline-black flex flex-col justify-start items-center gap-[5px] cursor-pointer h-fit",
									selectedLicense === option.id ? "bg-black" : "bg-white",
								)}
								onClick={() => setSelectedLicense(option.id)}
							>
								<div
									className={cn(
										"text-18px font-medium leading-160% tracking-018px",
										selectedLicense === option.id ? "text-white font-suisse" : "text-black font-bold font-suit",
									)}
								>
									{option.name}
								</div>
								<div
									className={cn(
										"text-18px font-medium font-suisse leading-160% tracking-018px",
										selectedLicense === option.id ? "text-white" : "text-black",
									)}
								>
									{option.price.toLocaleString()} KRW
								</div>
								<div
									className={cn(
										"text-12px font-medium font-suisse leading-150% tracking-012px",
										selectedLicense === option.id ? "text-white" : "text-black",
									)}
								>
									{option.description}
								</div>
							</div>
						))}
					</div>

					{selectedOption && (
						<div className="flex flex-col items-center justify-center gap-25px">
							<div className="self-stretch p-12px rounded-[5px] flex flex-col justify-start items-start gap-[5px] overflow-hidden">
								<div className="font-bold leading-160% text-black text-16px font-suit -tracking-032px">
									{selectedOption.name} 라이센스 사용범위
								</div>
								<div className="flex flex-col items-start justify-center gap-10px">
									{selectedOption.benefits?.map((benefit, index) => (
										<div
											key={index}
											className={cn(
												"text-[12px] font-bold font-suit leading-150% tracking-012px",
												benefit.includes("저작권 표기")
													? benefit.includes("필수")
														? "text-hbc-red"
														: "text-hbc-blue"
													: "text-hbc-gray-400",
											)}
										>
											{benefit}
										</div>
									))}
								</div>
							</div>
						</div>
					)}
				</div>

				<Popup.PopupFooter>
					<Popup.PopupButton onClick={handleChangeLicense}>변경하기</Popup.PopupButton>
				</Popup.PopupFooter>
			</Popup.PopupContent>
		</Popup.Popup>
	);
};
