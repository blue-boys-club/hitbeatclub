import { memo, useState, useMemo, type ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { useUnifiedCart } from "@/hooks/use-unified-cart";
import { useToast } from "@/hooks/use-toast";
import { MobileBuyOrCartModal } from "../../search/modals/MobileBuyOrCartModal";
import { cn } from "@/common/utils";
import type { ProductSearchResponse } from "@/apis/search/search.type";
import type { ProductLikeResponse, ProductListPagingResponse, ProductDetailResponse } from "@hitbeatclub/shared-types";

// Product data union matching MobileBuyOrCartModal
export type MobileProductData =
	| ProductSearchResponse["products"][number]
	| ProductLikeResponse
	| ProductListPagingResponse["data"][number]
	| ProductDetailResponse;

interface MobilePurchaseWithCartTriggerProps {
	/** 상품 데이터 (검색, 좋아요, 팔로우 등) */
	product: MobileProductData;
	/** 커스텀 트리거 컴포넌트 */
	children?: ReactNode | (({ isOnCart }: { isOnCart: boolean }) => ReactNode);
	/** 기본 버튼 className (children 없을 때) */
	className?: string;
	/** asChild 옵션 (Slot 지원) */
	asChild?: boolean;
	/** Callback when modal is opened */
	onModalOpen?: () => void;
	/** Callback when modal is closed */
	onModalClose?: () => void;
}

/**
 * 모바일 환경에서 사용하는 구매/장바구니 트리거 컴포넌트
 * - product 객체를 직접 전달받아 MobileBuyOrCartModal을 연동합니다.
 * - useUnifiedCart 훅으로 장바구니 상태를 확인합니다.
 * - children을 사용하여 UI를 자유롭게 커스터마이징할 수 있습니다.
 */
export const MobilePurchaseWithCartTrigger = memo(
	({
		product,
		children,
		className,
		asChild = false,
		onModalOpen,
		onModalClose,
	}: MobilePurchaseWithCartTriggerProps) => {
		const { isOnCart } = useUnifiedCart();
		const { toast } = useToast();
		const [isModalOpen, setIsModalOpen] = useState(false);

		// 현재 상품이 장바구니에 있는지 여부
		const onCart = useMemo(() => isOnCart(product.id), [product.id, isOnCart]);

		// 클릭 핸들러
		const handleClick = (e?: React.MouseEvent) => {
			// Prevent click from bubbling (e.g., to mobile player bar)
			e?.stopPropagation();
			if (!product) {
				toast({
					description: "상품 정보를 불러오는 중입니다.",
				});
				return;
			}
			onModalOpen?.();
			setIsModalOpen(true);
		};

		// 트리거 렌더링
		const renderTrigger = () => {
			if (children) {
				if (typeof children === "function") {
					const element = children({ isOnCart: onCart });
					return asChild ? (
						<Slot onClick={handleClick}>{element}</Slot>
					) : (
						<div
							onClick={handleClick}
							style={{ cursor: "pointer" }}
						>
							{element}
						</div>
					);
				}
				return asChild ? (
					<Slot onClick={handleClick}>{children}</Slot>
				) : (
					<div
						onClick={handleClick}
						style={{ cursor: "pointer" }}
					>
						{children}
					</div>
				);
			}

			// 기본 버튼 (단순 Buy 텍스트)
			return (
				<button
					className={cn(
						"bg-black text-white rounded-15px px-6px h-13px text-8px font-semibold disabled:opacity-50",
						className,
					)}
					disabled={onCart}
					onClick={handleClick}
				>
					{onCart ? "In Cart" : "Buy"}
				</button>
			);
		};

		return (
			<>
				{renderTrigger()}
				<MobileBuyOrCartModal
					isOpen={isModalOpen}
					onClose={() => {
						setIsModalOpen(false);
						onModalClose?.();
					}}
					product={product}
				/>
			</>
		);
	},
);

MobilePurchaseWithCartTrigger.displayName = "MobilePurchaseWithCartTrigger";
