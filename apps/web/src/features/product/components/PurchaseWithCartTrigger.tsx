import { memo, useMemo, useState, type ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { useQuery } from "@tanstack/react-query";
import { getUserMeQueryOption, useCartListQueryOptions } from "@/apis/user/query/user.query-option";
import { useCreateCartItemMutation, useDeleteCartItemMutation } from "@/apis/user/mutations";
import { getProductQueryOption } from "@/apis/product/query/product.query-option";
import { useToast } from "@/hooks/use-toast";
import { PurchaseButton } from "@/components/ui";
import { ProductDetailLicenseModal } from "./modal/ProductDetailLicenseModal";
import { LICENSE_MAP_TEMPLATE } from "@/apis/product/product.dummy";
import { LicenseType } from "../product.constants";

interface PurchaseWithCartTriggerProps {
	/**
	 * 상품 ID
	 */
	productId: number;

	/**
	 * 커스텀 트리거 컴포넌트
	 * 함수로 전달하면 장바구니 상태를 받을 수 있습니다
	 */
	children?: ReactNode | (({ isOnCart }: { isOnCart: boolean }) => ReactNode);

	/**
	 * 기본 버튼의 클래스명 (children이 없을 때만 적용)
	 */
	className?: string;

	/**
	 * asChild가 true이면 Slot을 사용합니다
	 */
	asChild?: boolean;
}

/**
 * 장바구니 기능이 통합된 구매 트리거 컴포넌트
 *
 * @description
 * - productId만 전달하면 장바구니 상태 확인 및 라이센스 모달 연동
 * - children이 없으면 기본 PurchaseButton 렌더링
 * - children이 있으면 해당 컴포넌트를 렌더링하되 클릭 시 라이센스 모달 실행
 * - children이 함수면 isOnCart 상태를 전달
 *
 * @example
 * // 기본 사용
 * <PurchaseWithCartTrigger productId={123} />
 *
 * // 커스텀 버튼 사용 (상태 받기)
 * <PurchaseWithCartTrigger productId={123}>
 *   {({ isOnCart }) => (
 *     <CustomButton variant={isOnCart ? "secondary" : "primary"}>
 *       {isOnCart ? "장바구니에 있음" : "구매하기"}
 *     </CustomButton>
 *   )}
 * </PurchaseWithCartTrigger>
 *
 * // 일반 컴포넌트 사용
 * <PurchaseWithCartTrigger productId={123} asChild>
 *   <button>커스텀 버튼</button>
 * </PurchaseWithCartTrigger>
 */
export const PurchaseWithCartTrigger = memo(
	({ productId, children, className, asChild = false }: PurchaseWithCartTriggerProps) => {
		const { toast } = useToast();
		const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);

		// 사용자 정보 가져오기
		const { data: user } = useQuery(getUserMeQueryOption());

		// 상품 정보 가져오기
		const { data: product } = useQuery({
			...getProductQueryOption(productId),
		});

		// 장바구니 데이터 가져오기
		const { data: cartItems } = useQuery({
			...useCartListQueryOptions(user?.id ?? 0),
			enabled: !!user?.id,
		});

		// 장바구니 mutations
		const createCartItemMutation = useCreateCartItemMutation(user?.id ?? 0);
		const deleteCartItemMutation = useDeleteCartItemMutation(user?.id ?? 0);

		// 현재 상품이 장바구니에 있는지 확인
		const cartItem = useMemo(() => {
			if (!cartItems || !product) return null;
			return cartItems.find((item) => item.product?.id === product.id);
		}, [cartItems, product]);

		const isOnCart = useMemo(() => {
			return !!cartItem;
		}, [cartItem]);

		// 라이센스 정보 처리
		const licenses = useMemo(() => {
			if (!product?.licenseInfo) return [];

			return product.licenseInfo.map((licenseInfo) => ({
				id: licenseInfo.id,
				type: licenseInfo.type as LicenseType,
				price: licenseInfo.price,
				...LICENSE_MAP_TEMPLATE[licenseInfo.type as keyof typeof LICENSE_MAP_TEMPLATE],
			}));
		}, [product?.licenseInfo]);

		const cheapestLicensePrice = useMemo(() => {
			if (licenses.length === 0) return 10000;
			return Math.min(...licenses.map((license) => license.price));
		}, [licenses]);

		// 클릭 핸들러
		const handleClick = () => {
			if (!user) {
				toast({
					description: "로그인 후 이용해주세요.",
				});
				return;
			}

			if (!product) {
				toast({
					description: "상품 정보를 불러오는 중입니다.",
				});
				return;
			}

			// 라이센스 모달 열기
			setIsLicenseModalOpen(true);
		};

		// 렌더링할 컴포넌트 결정
		const renderTrigger = () => {
			if (children) {
				// children이 함수인 경우
				if (typeof children === "function") {
					const childrenElement = children({ isOnCart });

					if (asChild) {
						return <Slot onClick={handleClick}>{childrenElement}</Slot>;
					} else {
						return (
							<div
								onClick={handleClick}
								style={{ cursor: "pointer" }}
							>
								{childrenElement}
							</div>
						);
					}
				}

				// children이 일반 ReactNode인 경우
				if (asChild) {
					return <Slot onClick={handleClick}>{children}</Slot>;
				} else {
					return (
						<div
							onClick={handleClick}
							style={{ cursor: "pointer" }}
						>
							{children}
						</div>
					);
				}
			}

			// 기본 PurchaseButton 사용
			return (
				<PurchaseButton
					iconColor="var(--hbc-white)"
					className={`outline-4 outline-hbc-black font-suisse ${className || ""}`}
					onClick={handleClick}
				>
					{cheapestLicensePrice?.toLocaleString()} KRW
				</PurchaseButton>
			);
		};

		return (
			<>
				{renderTrigger()}

				{/* 라이센스 선택 모달 */}
				{product && (
					<ProductDetailLicenseModal
						productId={product.id}
						isOpen={isLicenseModalOpen}
						onClose={() => setIsLicenseModalOpen(false)}
					/>
				)}
			</>
		);
	},
);

PurchaseWithCartTrigger.displayName = "PurchaseWithCartTrigger";
