"use client";

import { CartArtistSection, CartItemWithProductDetails } from "../features/cart/components/CartArtistSection";
import { CartHeader } from "../features/cart/components/CartHeader";
import { CartPaymentDetail, CheckoutItem } from "../features/cart/components/CartPaymentDetail";
import { useCartStore } from "@/stores/cart";
import { PRODUCTS_MAP } from "@/apis/product/product.dummy";
import { useMemo } from "react";

// Define a type for an artist with their cart items
interface ArtistWithCartItems {
	artistId: number;
	artistName: string;
	artistImageUrl: string;
	items: CartItemWithProductDetails[];
}

const CartPage = () => {
	const cartStoreItems = useCartStore((state) => state.items);

	const { artistsWithItems, checkoutItems, subtotal, total } = useMemo(() => {
		const detailedCartItems: CartItemWithProductDetails[] = [];
		let calculatedSubtotal = 0;

		for (const cartItem of cartStoreItems) {
			const product = PRODUCTS_MAP[cartItem.id];
			if (product) {
				const selectedLicense = product.licenses.find((lic) => lic.id === cartItem.licenseId);
				if (selectedLicense) {
					detailedCartItems.push({
						id: product.id,
						imageUrl: product.albumImgSrc, // Or a specific cart item image if available
						title: product.title,
						licenseId: selectedLicense.id,
						licenseName: selectedLicense.name,
						licenseDescription: selectedLicense.description,
						type: product.type,
						price: selectedLicense.price,
					});
					calculatedSubtotal += selectedLicense.price;
				}
			}
		}

		// Group items by artist
		const groupedByArtist: Record<string, ArtistWithCartItems> = {};
		for (const item of detailedCartItems) {
			const product = PRODUCTS_MAP[item.id]; // item.id is productId
			if (product) {
				const artistName = product.artist;
				if (!groupedByArtist[artistName]) {
					groupedByArtist[artistName] = {
						artistId: product.id, // Assuming artist ID might be the product ID or requires a different source
						artistName: product.artist,
						artistImageUrl: product.artistImgSrc,
						items: [],
					};
				}
				groupedByArtist[artistName]?.items.push(item);
			}
		}

		const artistsArray = Object.values(groupedByArtist);

		const preparedCheckoutItems: CheckoutItem[] = detailedCartItems.map((item) => ({
			id: item.id,
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
	}, [cartStoreItems]);

	if (cartStoreItems.length === 0) {
		return (
			<div className="flex flex-col h-full overflow-hidden">
				<div className="flex-shrink-0">
					<CartHeader />
				</div>
				<div className="flex flex-col items-center justify-center flex-1 h-full">
					<p className="text-xl text-hbc-gray-400">Your cart is empty.</p>
					{/* Optionally, add a button to go to shopping page */}
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
					{artistsWithItems.map((artistData) => (
						<CartArtistSection
							key={artistData.artistId} // Consider a more stable artist ID if possible
							artistId={artistData.artistId}
							artistName={artistData.artistName}
							artistImageUrl={artistData.artistImageUrl}
							items={artistData.items}
						/>
					))}
				</div>
				<div className="sticky rounded-lg h-fit top-20">
					<CartPaymentDetail
						checkoutItems={checkoutItems}
						subtotal={subtotal}
						serviceFee={0} // Replace with actual service fee if any
						total={total}
					/>
				</div>
			</div>
		</div>
	);
};

export default CartPage;
