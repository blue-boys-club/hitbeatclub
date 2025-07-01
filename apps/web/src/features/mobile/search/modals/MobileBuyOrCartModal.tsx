"use client";

import { Acapella, Beat } from "@/assets/svgs";
import { Popup, PopupContent, PopupDescription, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import Image from "next/image";
import { memo, useMemo, useState } from "react";
import { ProductSearchResponse } from "@/apis/search/search.type";
import { ProductDetailResponse, ProductLikeResponse, ProductListPagingResponse } from "@hitbeatclub/shared-types";
import { useUnifiedCart } from "@/hooks/use-unified-cart";
import { useToast } from "@/hooks/use-toast";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRouter } from "next/navigation";

type ProductData =
	| ProductSearchResponse["products"][number]
	| ProductLikeResponse
	| ProductListPagingResponse["data"][number]
	| ProductDetailResponse;

interface MobileBuyOrCartModalProps {
	isOpen: boolean;
	onClose: () => void;
	product: ProductData;
}

export const MobileBuyOrCartModal = memo(({ isOpen, onClose, product }: MobileBuyOrCartModalProps) => {
	const [selectedLicenseId, setSelectedLicenseId] = useState<number>(product.licenseInfo?.[0]?.id || 0);
	const [isProcessing, setIsProcessing] = useState(false);
	const router = useRouter();
	// Toast 훅
	const { toast } = useToast();

	// 통합 카트 훅
	const { addItem } = useUnifiedCart();

	// BPM 표시 로직
	const bpmDisplay =
		product.minBpm === product.maxBpm ? `${product.minBpm}BPM` : `${product.minBpm}BPM - ${product.maxBpm}BPM`;

	// 선택된 라이센스 정보
	const selectedLicense =
		product.licenseInfo?.find((license) => license.id === selectedLicenseId) || product.licenseInfo?.[0];

	// 장바구니 추가 핸들러
	const handleAddToCart = async () => {
		if (!selectedLicense?.id) {
			toast({
				description: "라이센스를 선택해주세요",
				variant: "destructive",
			});
			return;
		}

		setIsProcessing(true);
		try {
			await addItem(product.id, selectedLicense.id);
			toast({
				description: "장바구니에 추가되었습니다",
			});
			onClose();
		} catch (error) {
			console.error("장바구니 추가 실패:", error);
			toast({
				description: "장바구니 추가에 실패했습니다",
				variant: "destructive",
			});
		} finally {
			setIsProcessing(false);
		}
	};

	// 구매 핸들러 (현재는 장바구니와 동일하게 동작)
	const handleBuy = async () => {
		// TODO: 실제 구매 로직 구현
		await handleAddToCart();
		router.push("/mobile/my/cart");
	};
	const label = useMemo(() => {
		const selectedLicense = product.licenseInfo?.[0];
		if (selectedLicense) {
			if ("label" in selectedLicense) {
				return selectedLicense.label;
			}
			return selectedLicense.type.toUpperCase();
		}
		return "";
	}, [product.licenseInfo]);
	return (
		<Popup
			open={isOpen}
			onOpenChange={onClose}
			variant="mobile"
		>
			<PopupContent
				className="w-[238px] flex flex-col bg-[#DADADA] z-[400]"
				overlayClassName="z-[400]"
				onClick={(e) => e.stopPropagation()}
			>
				<VisuallyHidden>
					<PopupTitle>구매 또는 장바구니 담기</PopupTitle>
					<PopupDescription>구매 또는 장바구니 담기</PopupDescription>
				</VisuallyHidden>
				<div className="flex flex-col gap-4">
					<div className="flex gap-2">
						<div className="w-76px h-76px relative rounded-5px overflow-hidden">
							<Image
								alt={product.productName}
								src={product.coverImage?.url || ""}
								fill
								className="object-cover"
							/>
						</div>
						<div className="flex flex-col gap-10px">
							<div className="flex flex-col">
								<span className="font-semibold text-12px leading-100%">{product.productName}</span>
								<span className="text-10px leading-10px mt-1px">{product.seller.stageName}</span>
								{product.category === "ACAPELA" ? <Acapella className="mt-3px" /> : <Beat className="mt-3px" />}
							</div>
							<div className="flex flex-col gap-2px font-[450] text-8px leading-100%">
								<span>{bpmDisplay}</span>
								<span>
									{product.musicKey} {product.scaleType?.toLowerCase()}
								</span>
							</div>
						</div>
					</div>
					{selectedLicense && (
						<div className="flex flex-col items-center gap-2px">
							<div className="font-medium text-12px leading-100%">{label} 라이센스 사용범위</div>
							<div className="flex gap-10px font-bold text-8px leading-150%">
								{label.toUpperCase() === "MASTER" ? (
									<>
										<span>믹스테잎용 곡 녹음</span>
										<span>1개의 상업적 곡 녹음</span>
									</>
								) : (
									<>
										<span>무제한 상업적 사용</span>
										<span>독점적 라이센스</span>
									</>
								)}
							</div>
						</div>
					)}
					<div className="flex flex-col gap-1">
						{product.licenseInfo?.map((license) => (
							<button
								key={license.id}
								onClick={() => setSelectedLicenseId(license.id)}
								className={`h-44px rounded-3px flex flex-col justify-center items-center gap-1 font-[450] text-8px leading-100% ${
									selectedLicenseId === license.id ? "bg-black text-white" : "bg-white text-black"
								}`}
							>
								<span>{"label" in license ? license.label : license.type.toUpperCase()}</span>
								<span>{license.price?.toLocaleString()} KRW</span>
								<span>MP3, WAV</span>
							</button>
						))}
					</div>
					<div className="flex gap-1">
						<button
							className="rounded-3px h-20px flex-1 font-bold text-8px leading-100% bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed"
							onClick={handleAddToCart}
							disabled={isProcessing}
						>
							{isProcessing ? "처리중..." : "장바구니 담기"}
						</button>
						<button
							className="rounded-3px h-20px flex-1 font-bold text-8px leading-100% bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed"
							onClick={handleBuy}
							disabled={isProcessing}
						>
							{isProcessing ? "처리중..." : "구매하기"}
						</button>
					</div>
				</div>
			</PopupContent>
		</Popup>
	);
});

MobileBuyOrCartModal.displayName = "MobileBuyOrCartModal";
