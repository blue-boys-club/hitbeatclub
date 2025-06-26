"use client";

import { CartArtistSection, CartItemWithProductDetails } from "../features/cart/components/CartArtistSection";
import { CartHeader } from "../features/cart/components/CartHeader";
import { CartPaymentDetail, CheckoutItem } from "../features/cart/components/CartPaymentDetail";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/stores/cart";
import { getProductsByIdsQueryOption } from "@/apis/product/query/product.query-option";
import { useShallow } from "zustand/react/shallow";

// Define a type for an artist with their cart items
interface ArtistWithCartItems {
	artistId: number;
	artistSlug: string;
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
	const {
		items: cartItemsStore,
		addItem,
		removeItem,
	} = useCartStore(
		useShallow((state) => ({
			items: state.items,
			addItem: state.addItem,
			removeItem: state.removeItem,
		})),
	);

	const productIds = Array.from(new Set(cartItemsStore.map((c) => c.productId)));

	const {
		data: products,
		isLoading,
		isError,
		error,
	} = useQuery({
		...getProductsByIdsQueryOption(productIds),
		enabled: productIds.length > 0,
	});

	// 카트 데이터를 변환하여 UI에 필요한 형태로 만들기
	const { artistsWithItems, checkoutItems, subtotal, total } = useMemo(() => {
		if (!products || products.length === 0) {
			return {
				artistsWithItems: [],
				checkoutItems: [],
				subtotal: 0,
				total: 0,
			};
		}

		console.log("CartPage - products:", products);

		const detailedCartItems: CartItemWithProductDetails[] = [];
		let calculatedSubtotal = 0;

		// 각 카트 아이템을 변환
		for (const product of products) {
			// Find matching cart item
			const cartItem = cartItemsStore.find((c) => c.productId === product.id);
			if (!cartItem) continue;

			const { productId, licenseId } = cartItem;

			// Build license arrays
			const availableLicenses = (product.licenseInfo || []).map((l: any) => {
				const label = (l.label ?? l.type ?? "").toString().toUpperCase();
				return {
					id: l.id,
					type: label as "MASTER" | "EXCLUSIVE",
					price: l.price,
				};
			});

			// Find selected license info
			const selectedLicense = availableLicenses.find((l) => l.id === licenseId) || availableLicenses[0];
			if (!selectedLicense) continue;

			const licenseName = selectedLicense.type;
			const licenseDescription = selectedLicense.type === "MASTER" ? "상업적 이용 가능" : "독점 사용 가능";

			detailedCartItems.push({
				cartId: productId,
				productId: product.id,
				imageUrl: product.coverImage?.url || "",
				title: product.productName,
				licenseType: selectedLicense.type,
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
			const cartItem = products.find((p) => p.id === item.productId);
			if (!cartItem) continue;

			const seller = cartItem.seller;
			const artistName = seller.stageName;

			if (!groupedByArtist[artistName]) {
				groupedByArtist[artistName] = {
					artistId: seller.id,
					artistSlug: seller.slug || "",
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
	}, [products, cartItemsStore]);

	const handleDeleteItem = (productId: number) => {
		removeItem(productId);
		toast({ description: "장바구니에서 삭제되었습니다." });
	};

	const handleUpdateItemLicense = (productId: number, licenseId: number) => {
		addItem(productId, licenseId); // addItem updates license if exists
		toast({ description: "라이센스가 변경되었습니다." });
	};

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
							<p className="text-lg text-gray-500">카트가 비었습니다.</p>
						</div>
					) : (
						artistsWithItems.map((artistData) => (
							<CartArtistSection
								key={artistData.artistId}
								artistSlug={artistData.artistSlug}
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
