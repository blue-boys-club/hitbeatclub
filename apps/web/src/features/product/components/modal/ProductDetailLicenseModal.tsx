import { useState, memo, useMemo, useCallback } from "react";
import * as Popup from "@/components/ui/Popup";
import { cn } from "@/common/utils";
import { useRouter } from "next/navigation";
import { getProductQueryOption } from "@/apis/product/query/product.query-option";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { LICENSE_MAP_TEMPLATE } from "@/apis/product/product.dummy";
import { useUnifiedCart } from "@/hooks/use-unified-cart";

interface ProductDetailLicenseModalProps {
	isOpen: boolean;
	onClose: () => void;
	productId: number;
}

type LicenseType = "MASTER" | "EXCLUSIVE";

export const ProductDetailLicenseModal = memo(({ isOpen, onClose, productId }: ProductDetailLicenseModalProps) => {
	const router = useRouter();
	const { toast } = useToast();

	// 상품 정보 가져오기
	const { data: product } = useQuery({
		...getProductQueryOption(productId),
		enabled: isOpen && !!productId,
	});

	// 통합 카트 훅 사용
	const { addItem } = useUnifiedCart();

	// 상품의 라이센스 정보와 템플릿 정보를 조합
	const licenses = useMemo(() => {
		if (!product?.licenseInfo) return [];

		return product.licenseInfo.map((licenseInfo) => ({
			id: licenseInfo.id,
			type: licenseInfo.type,
			price: licenseInfo.price,
			...LICENSE_MAP_TEMPLATE[licenseInfo.type as LicenseType],
		}));
	}, [product?.licenseInfo]);

	const [selectedLicenseType, setSelectedLicenseType] = useState<LicenseType>("MASTER");

	// 선택된 라이센스 정보
	const selectedLicense = useMemo(
		() => licenses.find((license) => license.type === selectedLicenseType),
		[licenses, selectedLicenseType],
	);

	// 장바구니에 추가하는 함수 (로그인 상태에 따라 자동으로 서버/로컬 카트 처리)
	const addToCart = useCallback(async () => {
		if (!selectedLicense) {
			toast({
				description: "라이센스를 선택해주세요.",
				variant: "destructive",
			});
			return false;
		}

		try {
			// 통합 카트 훅의 addItem 사용 (로그인 상태에 따라 자동 처리)
			await addItem(productId, selectedLicense.id);
			return true;
		} catch (error) {
			console.error("장바구니 추가 실패:", error);
			return false;
		}
	}, [selectedLicense, productId, addItem, toast]);

	// 장바구니 담기 핸들러
	const handleCart = useCallback(async () => {
		const success = await addToCart();
		if (success) {
			toast({
				description: "장바구니에 추가되었습니다.",
			});
			onClose();
		}
	}, [addToCart, onClose, toast]);

	// 구매하기 핸들러 (장바구니 담고 이동)
	const handlePurchase = useCallback(async () => {
		const success = await addToCart();
		if (success) {
			router.push("/cart");
			onClose();
		}
	}, [addToCart, router, onClose]);

	if (!product || !licenses.length) {
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
							{licenses.map((option) => (
								<div
									key={option.type}
									className={cn(
										"p-12px rounded-lg outline-2 outline-offset-[-2px] outline-black flex flex-col justify-start items-center gap-[5px] cursor-pointer h-fit",
										selectedLicenseType === option.type ? "bg-black" : "bg-white",
									)}
									onClick={() => setSelectedLicenseType(option.type as LicenseType)}
								>
									<div
										className={cn(
											"text-18px font-medium leading-160% tracking-018px",
											selectedLicenseType === option.type ? "text-white font-suisse" : "text-black font-bold font-suit",
										)}
									>
										{option.name}
									</div>
									<div
										className={cn(
											"text-18px font-medium font-suisse leading-160% tracking-018px",
											selectedLicenseType === option.type ? "text-white" : "text-black",
										)}
									>
										{option.price.toLocaleString()} KRW
									</div>
									<div
										className={cn(
											"text-12px font-medium font-suisse leading-150% tracking-012px",
											selectedLicenseType === option.type ? "text-white" : "text-black",
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
