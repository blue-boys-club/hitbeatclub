"use client";

import * as Popup from "@/components/ui/Popup";
import { useEffect, useState } from "react";
import { cn } from "@/common/utils";
import { useQuery } from "@tanstack/react-query";
import { getProductQueryOption } from "../../../../apis/product/query/product.query-option";

interface LicenseChangeModalProps {
	isOpen: boolean;
	onClose: () => void;
	currentLicenseId: number;
	currentItemId: number;
	onChangeLicense: (id: number, licenseId: number) => void;
}

export type LicenseOption = {
	id: number;
	name: string;
	description: string;
	price: number;
	notes?: (string | { text: string; color: string })[];
};

export const LicenseChangeModal = ({
	isOpen,
	onClose,
	currentLicenseId,
	currentItemId,
	onChangeLicense,
}: LicenseChangeModalProps) => {
	const [selectedLicenseId, setSelectedLicenseId] = useState<number>(currentLicenseId);

	const queryOptions = getProductQueryOption(currentItemId);
	const {
		data: productLicenses,
		isLoading,
		isError,
		error,
	} = useQuery<Awaited<ReturnType<typeof queryOptions.queryFn>>, Error, LicenseOption[], typeof queryOptions.queryKey>({
		...queryOptions,
		select: (product) => {
			if (!product || !product.licenses) {
				return [];
			}
			return product.licenses as LicenseOption[];
		},
		enabled: isOpen && !!currentItemId,
		staleTime: 5 * 60 * 1000,
	});

	useEffect(() => {
		if (isOpen) {
			setSelectedLicenseId(currentLicenseId);
		}
	}, [currentLicenseId, isOpen]);

	const handleChangeLicense = () => {
		if (selectedLicenseId === currentLicenseId) {
			onClose();
			return;
		}
		onChangeLicense(currentItemId, selectedLicenseId);
		onClose();
	};

	const selectedOptionDetails = productLicenses?.find((option) => option.id === selectedLicenseId);

	return (
		<Popup.Popup
			open={isOpen}
			onOpenChange={onClose}
		>
			<Popup.PopupContent className="w-[500px] max-w-[500px]">
				<Popup.PopupHeader>
					<Popup.PopupTitle className="font-bold">라이센스 선택</Popup.PopupTitle>
				</Popup.PopupHeader>

				{isLoading && <div className="p-4 text-center">Loading licenses...</div>}
				{isError && <div className="p-4 text-center text-red-500">Error fetching product data: {error?.message}</div>}
				{!isLoading && !isError && productLicenses === undefined && (
					<div className="p-4 text-center text-orange-500">Product data not available.</div>
				)}

				{!isLoading && !isError && productLicenses && productLicenses.length > 0 && (
					<>
						<div className="flex flex-col items-center justify-start w-full gap-25px">
							<div className="flex items-start justify-start gap-4">
								{productLicenses.map((option) => (
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
								disabled={!productLicenses || productLicenses.length === 0}
							>
								변경하기
							</Popup.PopupButton>
						</Popup.PopupFooter>
					</>
				)}
				{!isLoading && !isError && productLicenses && productLicenses.length === 0 && (
					<div className="p-4 text-center text-gray-500">No licenses available for this product.</div>
				)}
			</Popup.PopupContent>
		</Popup.Popup>
	);
};
