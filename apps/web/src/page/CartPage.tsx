"use client";

import { CartArtistSection, CartItemWithProductDetails } from "../features/cart/components/CartArtistSection";
import { CartHeader } from "../features/cart/components/CartHeader";
import { CartPaymentDetail, CheckoutItem } from "../features/cart/components/CartPaymentDetail";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCartListQueryOptions } from "@/apis/user/query/user.query-option";
import { useDeleteCartItemMutation, useUpdateCartItemMutation } from "@/apis/user/mutations";
import { useToast } from "@/hooks/use-toast";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";

// Define a type for an artist with their cart items
interface ArtistWithCartItems {
	artistId: number;
	artistName: string;
	artistImageUrl: string;
	items: CartItemWithProductDetails[];
}

// Cart Item Skeleton Component
const CartItemSkeleton = () => (
	<div className="flex items-center gap-16px p-16px">
		<div className="w-60px h-60px bg-gray-200 rounded-12px animate-pulse"></div>
		<div className="flex-1">
			<div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
			<div className="w-1/2 h-3 bg-gray-200 rounded animate-pulse mb-2"></div>
			<div className="w-1/4 h-3 bg-gray-200 rounded animate-pulse"></div>
		</div>
		<div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
	</div>
);

// Artist Section Skeleton Component
const ArtistSectionSkeleton = () => (
	<div className="rounded-lg border-2 border-hbc-black bg-white">
		<div className="flex items-center gap-12px p-16px border-b border-gray-200">
			<div className="w-50px h-50px bg-gray-200 rounded-full animate-pulse"></div>
			<div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
		</div>
		<div className="divide-y divide-gray-200">
			<CartItemSkeleton />
			<CartItemSkeleton />
		</div>
	</div>
);

// Payment Detail Skeleton Component
const PaymentDetailSkeleton = () => (
	<div className="w-[400px] rounded-lg border-2 border-hbc-black bg-white p-20px">
		<div className="w-24 h-5 bg-gray-200 rounded animate-pulse mb-16px"></div>
		<div className="space-y-12px mb-16px">
			<div className="flex items-center gap-12px">
				<div className="w-40px h-40px bg-gray-200 rounded animate-pulse"></div>
				<div className="flex-1">
					<div className="w-3/4 h-3 bg-gray-200 rounded animate-pulse mb-1"></div>
					<div className="w-1/2 h-3 bg-gray-200 rounded animate-pulse"></div>
				</div>
				<div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
			</div>
			<div className="flex items-center gap-12px">
				<div className="w-40px h-40px bg-gray-200 rounded animate-pulse"></div>
				<div className="flex-1">
					<div className="w-3/4 h-3 bg-gray-200 rounded animate-pulse mb-1"></div>
					<div className="w-1/2 h-3 bg-gray-200 rounded animate-pulse"></div>
				</div>
				<div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
			</div>
		</div>
		<div className="border-t pt-16px">
			<div className="flex justify-between mb-8px">
				<div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
				<div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
			</div>
			<div className="flex justify-between mb-16px">
				<div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
				<div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
			</div>
			<div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
		</div>
	</div>
);

const CartPage = () => {
	const { toast } = useToast();

	const { data: user } = useQuery(getUserMeQueryOption());

	// Cart API를 사용하여 장바구니 데이터 가져오기

	const {
		data: cartItems,
		isLoading,
		isError,
		error,
	} = useQuery({
		...useCartListQueryOptions(user?.id ?? 0),
		enabled: !!user?.id,
	});

	// 장바구니 아이템 삭제 mutation
	const deleteCartItemMutation = useDeleteCartItemMutation(user?.id ?? 0);

	// 장바구니 아이템 라이센스 업데이트 mutation
	const updateCartItemMutation = useUpdateCartItemMutation(user?.id ?? 0);

	// 카트 데이터를 변환하여 UI에 필요한 형태로 만들기
	const { artistsWithItems, checkoutItems, subtotal, total } = useMemo(() => {
		if (!cartItems || cartItems.length === 0) {
			return {
				artistsWithItems: [],
				checkoutItems: [],
				subtotal: 0,
				total: 0,
			};
		}

		console.log("CartPage - cartItems:", cartItems);

		const detailedCartItems: CartItemWithProductDetails[] = [];
		let calculatedSubtotal = 0;

		// 각 카트 아이템을 변환
		for (const cartItem of cartItems) {
			const { product, selectedLicense } = cartItem;

			// product가 없는 경우 스킵
			if (!product) {
				console.warn(`CartPage - No product info for cart item ${cartItem.id}`);
				continue;
			}

			// 라이센스 정보 가져오기 (fallback 포함)
			let availableLicenses = [];
			if (product.licenseInfo && product.licenseInfo.length > 0) {
				// ProductResponseSchema에 licenseInfo가 있는 경우 사용
				availableLicenses = product.licenseInfo.map((license) => ({
					id: license.id,
					// TODO: 라이센스 타입 확인 필요
					type: license.label?.toUpperCase() as "MASTER" | "EXCLUSIVE",
					price: license.price,
				}));
			} else {
				// CRITICAL FALLBACK: licenseInfo가 없는 경우 selectedLicense 기반으로 생성
				console.warn(`CartPage - No licenseInfo for product ${product.id}, using fallback`);
				availableLicenses = [
					{
						id: selectedLicense.id,
						type: selectedLicense.type?.toUpperCase() as "MASTER" | "EXCLUSIVE",
						price: selectedLicense.price,
					},
				];
			}

			// 라이센스 이름과 설명 결정 (fallback 포함)
			let licenseName = selectedLicense.type;
			let licenseDescription = "";

			if (selectedLicense.type.toUpperCase() === "MASTER") {
				licenseName = "MASTER";
				licenseDescription = "상업적 이용 가능";
			} else if (selectedLicense.type.toUpperCase() === "EXCLUSIVE") {
				licenseName = "EXCLUSIVE";
				licenseDescription = "독점 사용 가능";
			}

			detailedCartItems.push({
				cartId: cartItem.id,
				productId: product.id,
				imageUrl: product.coverImage?.url || "", // ProductResponseSchema now includes coverImage
				title: product.productName,
				licenseType: selectedLicense.type as "MASTER" | "EXCLUSIVE",
				licenseName,
				licenseDescription,
				type: product.category === "BEAT" ? "beat" : "acapella",
				price: selectedLicense.price,
				selectedLicenseId: selectedLicense.id,
				availableLicenses,
			});

			calculatedSubtotal += selectedLicense.price;
		}

		console.log("CartPage - detailedCartItems:", detailedCartItems);

		// Group items by artist
		const groupedByArtist: Record<string, ArtistWithCartItems> = {};
		for (const item of detailedCartItems) {
			const cartItem = cartItems.find((c) => c.id === item.cartId);
			if (!cartItem) continue;

			const seller = cartItem.product.seller;
			const artistName = seller.stageName;

			if (!groupedByArtist[artistName]) {
				groupedByArtist[artistName] = {
					artistId: seller.id,
					artistName: artistName,
					artistImageUrl: seller.profileImageUrl || "",
					items: [],
				};
			}
			groupedByArtist[artistName]?.items.push(item);
		}

		const artistsArray = Object.values(groupedByArtist);
		console.log("CartPage - artistsArray:", artistsArray);

		const preparedCheckoutItems: CheckoutItem[] = detailedCartItems.map((item) => ({
			id: item.cartId,
			imageUrl: item.imageUrl,
			title: item.title,
			price: item.price,
		}));

		// TODO: Calculate serviceFee if applicable
		const serviceFee = 0;
		const calculatedTotal = calculatedSubtotal + serviceFee;

		return {
			artistsWithItems: artistsArray,
			checkoutItems: preparedCheckoutItems,
			subtotal: calculatedSubtotal,
			total: calculatedTotal,
		};
	}, [cartItems]);

	// 장바구니 아이템 삭제 핸들러
	const handleDeleteItem = async (cartId: number) => {
		try {
			await deleteCartItemMutation.mutateAsync(cartId);
			toast({
				description: "장바구니에서 삭제되었습니다.",
			});
		} catch (error) {
			console.error("Failed to delete cart item:", error);
			toast({
				description: "삭제 중 오류가 발생했습니다.",
				variant: "destructive",
			});
		}
	};

	// 라이센스 업데이트 핸들러
	const handleUpdateItemLicense = async (cartId: number, licenseId: number) => {
		try {
			await updateCartItemMutation.mutateAsync({ id: cartId, licenseId });
			toast({
				description: "라이센스가 변경되었습니다.",
			});
		} catch (error) {
			console.error("Failed to update cart item license:", error);
			toast({
				description: "라이센스 변경 중 오류가 발생했습니다.",
				variant: "destructive",
			});
		}
	};

	if (!cartItems || cartItems.length === 0) {
		return (
			<div className="flex flex-col h-full overflow-hidden">
				<div className="flex-shrink-0">
					<CartHeader />
				</div>
				<div className="flex flex-col items-center justify-center flex-1 h-full">
					<p className="text-xl text-hbc-gray-400">Your cart is empty.</p>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex flex-col h-full overflow-hidden">
				<div className="flex-shrink-0">
					<CartHeader />
				</div>
				<div className="flex gap-16px py-15px h-[calc(100%-60px)]">
					<div className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto p-1px gap-15px pr-16px">
						<ArtistSectionSkeleton />
						<ArtistSectionSkeleton />
					</div>
					<div className="sticky rounded-lg h-fit top-20">
						<PaymentDetailSkeleton />
					</div>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex flex-col h-full overflow-hidden">
				<div className="flex-shrink-0">
					<CartHeader />
				</div>
				<div className="flex flex-col items-center justify-center flex-1 h-full">
					<p className="text-xl text-red-500">Error loading cart items.</p>
					<div className="mt-4 text-sm text-red-400">
						<p>{error?.message || "Unknown error"}</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full overflow-hidden">
			<div className="flex-shrink-0">
				<CartHeader />
			</div>
			<div className="flex gap-16px py-15px h-[calc(100%-60px)]">
				<div className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto p-1px gap-15px pr-16px">
					{artistsWithItems.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full">
							<p className="text-lg text-gray-500">아이템을 표시할 수 없습니다</p>
						</div>
					) : (
						artistsWithItems.map((artistData) => (
							<CartArtistSection
								key={artistData.artistId}
								artistId={artistData.artistId}
								artistName={artistData.artistName}
								artistImageUrl={artistData.artistImageUrl}
								items={artistData.items}
								onDeleteItem={handleDeleteItem}
								onUpdateItemLicense={handleUpdateItemLicense}
							/>
						))
					)}
				</div>
				<div className="sticky rounded-lg h-fit top-20">
					<CartPaymentDetail
						checkoutItems={checkoutItems}
						subtotal={subtotal}
						serviceFee={0}
						total={total}
					/>
				</div>
			</div>
		</div>
	);
};

export default CartPage;
