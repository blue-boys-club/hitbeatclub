import { useMemo, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { useCartStore } from "@/stores/cart";
import { getUserMeQueryOption, useCartListQueryOptions } from "@/apis/user/query/user.query-option";
import { useCreateCartItemMutation } from "@/apis/user/mutations/useCreateCartItemMutation";
import { useDeleteCartItemMutation } from "@/apis/user/mutations/useDeleteCartItemMutation";
import { useUpdateCartItemMutation } from "@/apis/user/mutations/useUpdateCartItemMutation";
import { getProductsByIdsQueryOption } from "@/apis/product/query/product.query-option";
import { useToast } from "@/hooks/use-toast";
import { QUERY_KEYS } from "@/apis/query-keys";
import type { ProductDetailResponse } from "@hitbeatclub/shared-types/product";

// 통합 카트 아이템 타입
export interface UnifiedCartItem {
	productId: number;
	licenseId: number;
	id?: number; // 서버 카트 아이템의 경우에만 존재
}

// 공유 타입 사용
type Product = ProductDetailResponse;

// 통합 카트 훅의 반환 타입
export interface UseUnifiedCartReturn {
	// 카트 아이템들
	cartItems: UnifiedCartItem[];

	// 로딩 상태들
	isLoading: boolean;
	isCartLoading: boolean;
	isProductsLoading: boolean;

	// 에러 상태들
	isError: boolean;
	error: Error | null;

	// 상품 데이터
	products: Product[] | undefined;

	// 카트 조작 함수들
	addItem: (productId: number, licenseId: number) => Promise<void>;
	removeItem: (productId: number) => Promise<void>;
	updateItemLicense: (productId: number, licenseId: number) => Promise<void>;
	clearCart: () => Promise<void>;

	// 상태 확인 함수들
	isOnCart: (productId: number) => boolean;
	getCartItemByProductId: (productId: number) => UnifiedCartItem | undefined;

	// 메타 정보
	isLoggedIn: boolean;
	cartItemCount: number;
}

/**
 * 로그인/비로그인 상태에 따라 카트 처리를 통합하는 훅
 *
 * 비회원: localStorage 기반 카트 사용
 * 로그인: 서버 카트 사용, 로그인 시 localStorage 데이터를 서버로 동기화
 */
export const useUnifiedCart = (): UseUnifiedCartReturn => {
	const { toast } = useToast();
	const queryClient = useQueryClient();

	// 사용자 로그인 상태 확인
	const { data: user, isLoading: isUserLoading } = useQuery(getUserMeQueryOption());
	const isLoggedIn = !!user?.id;
	const userId = user?.id;

	// console.log("🔍 useUnifiedCart Debug:");
	// console.log("  - isLoggedIn:", isLoggedIn);
	// console.log("  - userId:", userId);
	// console.log("  - user:", user);

	// 로컬 카트 스토어
	const {
		items: localCartItems,
		addItem: addLocalItem,
		removeItem: removeLocalItem,
		clear: clearLocalCart,
	} = useCartStore(
		useShallow((state) => ({
			items: state.items,
			addItem: state.addItem,
			removeItem: state.removeItem,
			clear: state.clear,
		})),
	);

	// console.log("  - localCartItems:", localCartItems);

	// 서버 카트 데이터
	const {
		data: serverCartItems = [],
		isLoading: isServerCartLoading,
		isError: isServerCartError,
		error: serverCartError,
	} = useQuery({
		...useCartListQueryOptions(userId!),
		enabled: isLoggedIn && !!userId,
	});

	// console.log("  - serverCartItems:", serverCartItems);
	// console.log("  - isServerCartLoading:", isServerCartLoading);
	// console.log("  - isServerCartError:", isServerCartError);

	// 서버 카트 뮤테이션들 (로그인된 경우에만)
	const createCartItemMutation = useCreateCartItemMutation(userId || 0);
	const deleteCartItemMutation = useDeleteCartItemMutation(userId || 0);
	const updateCartItemMutation = useUpdateCartItemMutation(userId || 0);

	// 현재 활성 카트 아이템들 결정 (로그인 상태에 따라)
	const activeCartItems: UnifiedCartItem[] = useMemo(() => {
		// console.log("🎯 activeCartItems 계산 중:");
		// console.log("  - isLoggedIn:", isLoggedIn);
		// console.log("  - isServerCartLoading:", isServerCartLoading);
		// console.log("  - serverCartItems:", serverCartItems);
		// console.log("  - localCartItems:", localCartItems);

		if (isLoggedIn) {
			// 서버 카트가 로딩 중이면 로컬 카트를 보여줌
			if (isServerCartLoading) {
				// console.log("  → 서버 카트 로딩 중, 로컬 카트 사용");
				return localCartItems.map((item) => ({
					productId: item.productId,
					licenseId: item.licenseId,
				}));
			}
			// 서버 카트 데이터를 UnifiedCartItem 형태로 변환
			// console.log("  → 서버 카트 사용, 변환 시작");
			const result = serverCartItems.map((item) => {
				// console.log("    - 서버 카트 아이템:", item);
				return {
					productId: item.product.id, // product 객체에서 id 추출
					licenseId: item.selectedLicense.id, // selectedLicense 객체에서 id 추출
					id: item.id,
				};
			});
			console.log("  → 변환된 결과:", result);
			return result;
		} else {
			// 로컬 카트 데이터 사용
			// console.log("  → 비로그인, 로컬 카트 사용");
			return localCartItems.map((item) => ({
				productId: item.productId,
				licenseId: item.licenseId,
			}));
		}
	}, [isLoggedIn, isServerCartLoading, serverCartItems, localCartItems]);

	// console.log("  - activeCartItems 최종 결과:", activeCartItems);

	// 상품 ID 목록
	const productIds = useMemo(
		() => Array.from(new Set(activeCartItems.map((item) => item.productId))),
		[activeCartItems],
	);

	// 비로그인 상태에서만 products API 호출
	const {
		data: productsFromApi,
		isLoading: isProductsLoading,
		isError: isProductsError,
		error: productsError,
	} = useQuery({
		...getProductsByIdsQueryOption(productIds),
		enabled: productIds.length > 0 && !isLoggedIn, // 비회원이고 상품 ID가 있을 때만 호출
	});

	// 상품 데이터 - 로그인 상태에 따라 다르게 처리
	const products: any = useMemo(() => {
		// console.log("🎯 products 계산 중:");
		// console.log("  - isLoggedIn:", isLoggedIn);
		// console.log("  - isServerCartLoading:", isServerCartLoading);

		if (isLoggedIn) {
			// 로그인 상태: 서버 카트에서 product 정보 추출
			if (isServerCartLoading) {
				// console.log("  → 서버 카트 로딩 중, products = undefined");
				return undefined;
			}
			// console.log("  → 서버 카트에서 products 추출");
			const serverProducts = serverCartItems.map((item) => {
				// 서버 카트 아이템의 product에 selectedLicense 정보 추가
				const productWithSelectedLicense = {
					...item.product,
					selectedLicense: {
						...item.selectedLicense,
						type: item.selectedLicense.type?.toUpperCase() || "MASTER", // selectedLicense.type도 대문자로 변환
					},
					// licenseInfo에서 label을 type으로 변환 (Master -> MASTER, Exclusive -> EXCLUSIVE)
					licenseInfo:
						item.product.licenseInfo?.map((license) => ({
							id: license.id,
							type: license.label?.toUpperCase() || "MASTER", // label을 대문자로 변환하여 type으로 사용
							price: license.price,
						})) || [],
				};
				return productWithSelectedLicense;
			});
			// console.log("  → 서버에서 추출한 products:", serverProducts);
			return serverProducts;
		} else {
			// 비로그인 상태: products API 결과 사용
			// console.log("  → 비로그인, products API 결과 사용:", productsFromApi);
			return productsFromApi;
		}
	}, [isLoggedIn, isServerCartLoading, serverCartItems, productsFromApi]);

	// 로그인 전환 시 로컬 카트를 서버로 동기화
	const syncLocalCartToServer = useCallback(async () => {
		if (!isLoggedIn || !userId || localCartItems.length === 0) return;

		try {
			// 병렬로 모든 아이템을 서버에 추가
			const syncPromises = localCartItems.map((localItem) =>
				createCartItemMutation.mutateAsync({
					productId: localItem.productId,
					licenseId: localItem.licenseId,
				}),
			);

			await Promise.all(syncPromises);

			// 동기화 완료 후 로컬 카트만 비우기
			clearLocalCart();

			toast({
				description: `${localCartItems.length}개 아이템이 장바구니에 동기화되었습니다.`,
			});
		} catch (error) {
			console.error("카트 동기화 실패:", error);
			toast({
				description: "장바구니 동기화에 실패했습니다.",
				variant: "destructive",
			});
		}
	}, [isLoggedIn, userId, localCartItems, createCartItemMutation, clearLocalCart, toast]);

	// 로그인 상태 변경 감지 및 동기화 실행
	useEffect(() => {
		let timeoutId: NodeJS.Timeout;

		// 로그인 상태가 바뀌고 로컬 카트에 아이템이 있을 때 동기화
		if (isLoggedIn && localCartItems.length > 0 && !isUserLoading) {
			// 약간의 딜레이를 두어 서버 카트 로딩이 완료된 후 동기화
			timeoutId = setTimeout(() => {
				void syncLocalCartToServer();
			}, 1000);
		}

		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [isLoggedIn, localCartItems.length, isUserLoading, syncLocalCartToServer]);

	// 카트 아이템 추가
	const addItem = useCallback(
		async (productId: number, licenseId: number) => {
			try {
				if (isLoggedIn && userId) {
					// 서버 카트에 추가
					await createCartItemMutation.mutateAsync({
						productId,
						licenseId,
					});
					// 수동으로 서버 카트 쿼리 무효화
					await queryClient.invalidateQueries({
						queryKey: QUERY_KEYS.cart.list,
					});
				} else {
					// 로컬 카트에 추가
					addLocalItem(productId, licenseId);
				}
			} catch (error) {
				console.error("카트 아이템 추가 실패:", error);
				toast({
					description: "장바구니 추가에 실패했습니다.",
					variant: "destructive",
				});
			}
		},
		[isLoggedIn, userId, createCartItemMutation, addLocalItem, toast, queryClient],
	);

	// 카트 아이템 제거
	const removeItem = useCallback(
		async (productId: number) => {
			try {
				if (isLoggedIn && userId) {
					// 서버 카트에서 제거
					const cartItem = activeCartItems.find((item) => item.productId === productId);
					if (cartItem?.id) {
						await deleteCartItemMutation.mutateAsync(cartItem.id);
						// 수동으로 서버 카트 쿼리 무효화
						await queryClient.invalidateQueries({
							queryKey: QUERY_KEYS.cart.list,
						});
					}
				} else {
					// 로컬 카트에서 제거
					removeLocalItem(productId);
				}
			} catch (error) {
				console.error("카트 아이템 제거 실패:", error);
				toast({
					description: "장바구니 제거에 실패했습니다.",
					variant: "destructive",
				});
			}
		},
		[isLoggedIn, userId, activeCartItems, deleteCartItemMutation, removeLocalItem, toast, queryClient],
	);

	// 카트 아이템 라이센스 업데이트
	const updateItemLicense = useCallback(
		async (productId: number, licenseId: number) => {
			try {
				if (isLoggedIn && userId) {
					// 서버 카트 업데이트
					const cartItem = activeCartItems.find((item) => item.productId === productId);
					if (cartItem?.id) {
						await updateCartItemMutation.mutateAsync({
							id: cartItem.id,
							licenseId,
						});
						// 수동으로 서버 카트 쿼리 무효화
						await queryClient.invalidateQueries({
							queryKey: QUERY_KEYS.cart.list,
						});
					}
				} else {
					// 로컬 카트 업데이트 (addItem이 기존 아이템의 라이센스를 업데이트함)
					addLocalItem(productId, licenseId);
				}
			} catch (error) {
				console.error("카트 아이템 업데이트 실패:", error);
				toast({
					description: "라이센스 변경에 실패했습니다.",
					variant: "destructive",
				});
			}
		},
		[isLoggedIn, userId, activeCartItems, updateCartItemMutation, addLocalItem, toast, queryClient],
	);

	// 카트 비우기 - 로컬 카트만 비우기 (서버 카트는 건드리지 않음)
	const clearCart = useCallback(async () => {
		try {
			// 로컬 카트만 비우기
			clearLocalCart();
		} catch (error) {
			console.error("카트 비우기 실패:", error);
			toast({
				description: "장바구니 비우기에 실패했습니다.",
				variant: "destructive",
			});
		}
	}, [clearLocalCart, toast]);

	// 상품이 카트에 있는지 확인
	const isOnCart = useCallback(
		(productId: number) => {
			return activeCartItems.some((item) => item.productId === productId);
		},
		[activeCartItems],
	);

	// 상품 ID로 카트 아이템 찾기
	const getCartItemByProductId = useCallback(
		(productId: number) => {
			return activeCartItems.find((item) => item.productId === productId);
		},
		[activeCartItems],
	);

	// 로딩 및 에러 상태
	const isCartLoading = isLoggedIn ? isServerCartLoading : false;
	const isLoading = isUserLoading || isCartLoading || isProductsLoading;
	const isError = isProductsError || (isLoggedIn && isServerCartError);
	const error = productsError || (isLoggedIn ? serverCartError : null);

	return {
		cartItems: activeCartItems,
		isLoading,
		isCartLoading,
		isProductsLoading,
		isError,
		error,
		products,
		addItem,
		removeItem,
		updateItemLicense,
		clearCart,
		isOnCart,
		getCartItemByProductId,
		isLoggedIn,
		cartItemCount: activeCartItems.length,
	};
};
