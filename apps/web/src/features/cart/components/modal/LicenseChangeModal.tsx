"use client";

import * as Popup from "@/components/ui/Popup";
import { useState } from "react";
import { cn } from "@/common/utils";
import { useQuery } from "@tanstack/react-query";
import { getProductQueryOption } from "@/apis/product/query/product.query-option";

interface LicenseChangeModalProps {
	isOpen: boolean;
	onClose: () => void;
	productId: number;
	currentLicenseId: number;
	availableLicenses: Array<{
		id: number;
		type: "MASTER" | "EXCLUSIVE";
		price: number;
	}>;
	onChangeLicense: (licenseId: number) => void;
}

export type LicenseOption = {
	id: number;
	type: string;
	name: string;
	description: string;
	price: number;
	notes?: (string | { text: string; color: string })[];
};

type LicenseType = "MASTER" | "EXCLUSIVE";

// 라이센스 타입별 템플릿 (기존 LICENSE_MAP_TEMPLATE을 간소화)
const LICENSE_TEMPLATE = {
	MASTER: {
		name: "마스터",
		description: "상업적 이용 가능",
		notes: ["상업적 이용 가능", "무제한 배포", "저작권 표기 필수"],
	},
	EXCLUSIVE: {
		name: "익스클루시브",
		description: "독점 사용 가능",
		notes: ["독점 사용 가능", "무제한 배포", "상업적 이용 가능", "저작권 표기 선택"],
	},
};

export const LicenseChangeModal = ({
	isOpen,
	onClose,
	productId,
	currentLicenseId,
	availableLicenses,
	onChangeLicense,
}: LicenseChangeModalProps) => {
	const [selectedLicenseId, setSelectedLicenseId] = useState<number>(currentLicenseId);

	// 제품 상세 정보 조회 (더 많은 라이센스 정보를 위해)
	const { data: productDetail, isLoading } = useQuery({
		...getProductQueryOption(productId),
		enabled: isOpen,
		select: (response) => response.data,
	});

	// 최종 라이센스 옵션 결정: productDetail에서 가져온 라이센스 정보를 우선적으로 사용
	const finalLicenseOptions: LicenseOption[] = (() => {
		if (productDetail?.licenseInfo && productDetail.licenseInfo.length > 0) {
			// 제품 상세에서 라이센스 정보가 있는 경우 사용
			return productDetail.licenseInfo.map((license: any) => {
				const template = LICENSE_TEMPLATE[license.type as LicenseType];
				return {
					id: license.id,
					type: license.type,
					name: template.name,
					description: template.description,
					price: license.price,
					notes: template.notes,
				};
			});
		} else {
			// 없는 경우 availableLicenses 사용
			return availableLicenses.map((license) => {
				const template = LICENSE_TEMPLATE[license.type];
				return {
					id: license.id,
					type: license.type,
					name: template.name,
					description: template.description,
					price: license.price,
					notes: template.notes,
				};
			});
		}
	})();

	const handleChangeLicense = () => {
		if (selectedLicenseId === currentLicenseId) {
			onClose();
			return;
		}
		onChangeLicense(selectedLicenseId);
		onClose();
	};

	const selectedOptionDetails = finalLicenseOptions.find((option) => option.id === selectedLicenseId);

	return (
		<Popup.Popup
			open={isOpen}
			onOpenChange={onClose}
		>
			<Popup.PopupContent className="w-[500px] max-w-[500px]">
				<Popup.PopupHeader>
					<Popup.PopupTitle className="font-bold">라이센스 변경</Popup.PopupTitle>
				</Popup.PopupHeader>

				{isLoading ? (
					<div className="p-4 text-center">라이센스 정보를 불러오는 중...</div>
				) : finalLicenseOptions.length > 0 ? (
					<>
						<div className="flex flex-col items-center justify-start w-full gap-25px">
							<div className="flex items-start justify-start gap-4">
								{finalLicenseOptions.map((option) => (
									<div
										key={option.id}
										className={cn(
											"p-12px rounded-lg outline-2 outline-offset-[-2px] outline-black flex flex-col justify-start items-center gap-[5px] cursor-pointer h-fit",
											selectedLicenseId === option.id ? "bg-black" : "bg-white",
										)}
										onClick={() => setSelectedLicenseId(option.id)}
									>
										<div
											className={cn(
												"text-18px font-medium leading-160% tracking-018px",
												selectedLicenseId === option.id ? "text-white font-suisse" : "text-black font-bold font-suit",
											)}
										>
											{option.name}
										</div>
										<div
											className={cn(
												"text-18px font-medium font-suisse leading-160% tracking-018px",
												selectedLicenseId === option.id ? "text-white" : "text-black",
											)}
										>
											{option.price.toLocaleString()} KRW
										</div>
										<div
											className={cn(
												"text-12px font-medium font-suisse leading-150% tracking-012px",
												selectedLicenseId === option.id ? "text-white" : "text-black",
											)}
										>
											{option.description}
										</div>
									</div>
								))}
							</div>

							{selectedOptionDetails && (
								<div className="flex flex-col items-center justify-center gap-25px">
									<div className="self-stretch p-12px rounded-[5px] flex flex-col justify-start items-start gap-[5px] overflow-hidden">
										<div className="font-bold leading-160% text-black text-16px font-suit -tracking-032px">
											{selectedOptionDetails.name} 라이센스 사용범위
										</div>
										<div className="flex flex-col items-start justify-center gap-10px">
											{selectedOptionDetails.notes?.map((benefit, index) => (
												<div
													key={index}
													className={cn(
														"text-[12px] font-bold font-suit leading-150% tracking-012px",
														typeof benefit === "string"
															? benefit.includes("저작권 표기")
																? benefit.includes("필수")
																	? "text-hbc-red"
																	: "text-hbc-blue"
																: "text-hbc-gray-400"
															: benefit.color || "text-hbc-gray-400",
													)}
												>
													{typeof benefit === "string" ? benefit : benefit.text}
												</div>
											))}
										</div>
									</div>
								</div>
							)}
						</div>

						<Popup.PopupFooter>
							<Popup.PopupButton
								onClick={handleChangeLicense}
								disabled={isLoading || finalLicenseOptions.length === 0}
							>
								변경하기
							</Popup.PopupButton>
						</Popup.PopupFooter>
					</>
				) : (
					<div className="p-4 text-center text-gray-500">사용 가능한 라이센스가 없습니다.</div>
				)}
			</Popup.PopupContent>
		</Popup.Popup>
	);
};
