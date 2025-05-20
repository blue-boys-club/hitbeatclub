import { useState, memo, useMemo, useEffect, useCallback } from "react";
import * as Popup from "@/components/ui/Popup";
import { cn } from "@/common/utils";
import { useRouter } from "next/navigation";
import { getProductQueryOption } from "@/apis/product/query/product.query-option";
import { useQuery } from "@tanstack/react-query";
import { useCartStore } from "@/stores/cart";
import { useShallow } from "zustand/react/shallow";
import { useToast } from "@/hooks/use-toast";

interface ProductDetailLicenseModalProps {
	isOpen: boolean;
	onClose: () => void;
	productId: number;
}

export const ProductDetailLicenseModal = memo(({ isOpen, onClose, productId }: ProductDetailLicenseModalProps) => {
	const router = useRouter();
	const { data: product } = useQuery({
		...getProductQueryOption(productId),
		enabled: isOpen && !!productId,
	});
	const licenses = useMemo(() => product?.licenses, [product]);
	const [selectedLicenseId, setSelectedLicenseId] = useState<number>(licenses?.[0]?.id ?? 0);
	const selectedLicense = useMemo(
		() => licenses?.find((license) => license.id === selectedLicenseId),
		[licenses, selectedLicenseId],
	);
	const { addItem } = useCartStore(
		useShallow((state) => ({
			addItem: state.addItem,
		})),
	);

	const { toast } = useToast();

	useEffect(() => {
		if (licenses && licenses.length > 0 && selectedLicenseId === 0) {
			setSelectedLicenseId(licenses[0]!.id);
		}
	}, [licenses, selectedLicenseId]);

	const addToCart = useCallback(() => {
		if (selectedLicenseId) {
			addItem({
				id: productId,
				licenseId: selectedLicenseId,
			});
		}
	}, [addItem, productId, selectedLicenseId]);

	const handleCart = useCallback(() => {
		addToCart();
		toast({
			title: "장바구니에 추가되었습니다.",
		});
		onClose();
	}, [addToCart, onClose]);

	const handlePurchase = useCallback(() => {
		addToCart();
		router.push("/cart");
		onClose();
	}, [addToCart, router, onClose]);

	if (!product) {
		// Handle case where item is not provided, or return a loading/error state
		return null;
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
							{licenses?.map((option) => (
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
									{selectedLicense?.notes?.map((benefit, index) => (
										<div
											key={index}
											className={cn(
												"text-[12px] font-bold font-suit leading-150% tracking-012px",
												"text-hbc-gray-400",
												typeof benefit === "object" && benefit.color,
											)}
										>
											{typeof benefit === "string" ? benefit : benefit.text}
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

ProductDetailLicenseModal.displayName = "ProductDetailLicenseModal";
