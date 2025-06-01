"use client";

import * as Popup from "@/components/ui/Popup";
import { useMemo, useState, useEffect, useCallback, memo } from "react";
import { cn } from "@/common/utils";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProductQueryOption } from "@/apis/product/query/product.query-option"; // Assuming this path
import { useCartStore } from "@/stores/cart";
import { useShallow } from "zustand/react/shallow";
import { useToast } from "@/hooks/use-toast";

interface PurchaseModalProps {
	isOpen: boolean;
	onClose: () => void;
	productId: number; // Changed from item
}

type LicenseOption = {
	id: number;
	name: string;
	description: string;
	price: number;
	notes?: (string | { text: string; color?: string })[]; // Changed from benefits
};

export const PurchaseModal = memo(({ isOpen, onClose, productId }: PurchaseModalProps) => {
	const router = useRouter();
	const { data: product } = useQuery({
		...getProductQueryOption(productId),
		enabled: isOpen && !!productId,
	});

	const { toast } = useToast();

	// TODO: 라이센스 데이터 받아오기
	// const licenses = useMemo(() => product?.licenses as LicenseOption[] | undefined, [product]); // Cast if necessary
	const licenses = useMemo(
		() => [
			{
				id: 1,
				name: "라이센스 1",
				description: "라이센스 1 설명",
				price: 10000,
				notes: [
					{
						text: "라이센스 1 설명",
						color: "red",
					},
				],
			},
		],
		[],
	);

	const [selectedLicenseId, setSelectedLicenseId] = useState<number>(licenses?.[0]?.id ?? 0);
	const selectedLicense = useMemo(
		() => licenses?.find((license) => license.id === selectedLicenseId),
		[licenses, selectedLicenseId],
	);

	useEffect(() => {
		if (licenses && licenses.length > 0) {
			const currentSelectionIsValid = licenses.some((l) => l.id === selectedLicenseId);
			if (!currentSelectionIsValid || selectedLicenseId === 0) {
				setSelectedLicenseId(licenses[0]!.id);
			}
		} else if (!licenses) {
			setSelectedLicenseId(0);
		}
	}, [licenses, selectedLicenseId]);

	const { addItem } = useCartStore(
		useShallow((state) => ({
			addItem: state.addItem,
		})),
	);

	const addToCart = useCallback(() => {
		if (selectedLicenseId && product) {
			addItem({
				id: productId, // or product.id
				licenseId: selectedLicenseId,
			});
		}
	}, [addItem, productId, product, selectedLicenseId]);

	const handleCart = useCallback(() => {
		addToCart();
		toast({
			title: "장바구니에 추가되었습니다.",
		});
		onClose();
	}, [addToCart, onClose, toast]);

	const handlePurchase = useCallback(() => {
		addToCart();
		router.push("/cart");
		onClose();
	}, [addToCart, router, onClose]);

	if (!product || !licenses || licenses.length === 0) {
		return isOpen ? (
			<Popup.Popup
				open={isOpen}
				onOpenChange={onClose}
			>
				<Popup.PopupContent className="w-[500px] max-w-[500px]">
					<Popup.PopupHeader>
						<Popup.PopupTitle className="font-bold">라이센스 선택</Popup.PopupTitle>
					</Popup.PopupHeader>
					<div className="p-4 text-center">라이센스 정보를 불러오는 중이거나, 사용할 수 있는 라이센스가 없습니다.</div>
					<Popup.PopupFooter>
						<Popup.PopupButton onClick={onClose}>닫기</Popup.PopupButton>
					</Popup.PopupFooter>
				</Popup.PopupContent>
			</Popup.Popup>
		) : null;
	}

	return (
		<>
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

						<div className="flex flex-col items-center justify-center gap-25px">
							<div className="self-stretch p-12px rounded-[5px] flex flex-col justify-start items-start gap-[5px] overflow-hidden">
								<div className="font-bold leading-160% text-black text-16px font-suit -tracking-032px">
									{selectedLicense?.name} 라이센스 사용범위
								</div>
								<div className="flex flex-col items-start justify-center gap-10px">
									{selectedLicense?.notes?.map((note, index) => (
										<div
											key={index}
											className={cn(
												"text-[12px] font-bold font-suit leading-150% tracking-012px",
												"text-hbc-gray-400",
												typeof note === "object" && note.color,
											)}
										>
											{typeof note === "string" ? note : note.text}
										</div>
									))}
								</div>
							</div>
						</div>
					</div>

					<Popup.PopupFooter>
						<Popup.PopupButton onClick={handleCart}>장바구니 담기</Popup.PopupButton>
						<Popup.PopupButton onClick={handlePurchase}>구매하기</Popup.PopupButton>
					</Popup.PopupFooter>
				</Popup.PopupContent>
			</Popup.Popup>
		</>
	);
});

PurchaseModal.displayName = "PurchaseModal";
