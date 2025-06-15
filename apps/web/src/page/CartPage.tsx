"use client";

import { CartArtistSection, CartItemWithProductDetails } from "../features/cart/components/CartArtistSection";
import { CartHeader } from "../features/cart/components/CartHeader";
import { CartPaymentDetail, CheckoutItem } from "../features/cart/components/CartPaymentDetail";
import { useCartStore } from "@/stores/cart";
import { LICENSE_MAP_TEMPLATE } from "@/apis/product/product.dummy";
import { useMemo, useEffect } from "react";
import { useQueries } from "@tanstack/react-query";
import { getProductQueryOption } from "@/apis/product/query/product.query-option";
import { getArtistDetailQueryOption } from "@/apis/artist/query/artist.query-options";
import { AxiosError } from "axios";

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
	const cartStoreItems = useCartStore((state) => state.items);

	// 각 카트 아이템에 대해 상품 정보를 가져옴
	const productQueries = useQueries({
		queries: cartStoreItems.map((item) => ({
			...getProductQueryOption(item.id),
		})),
	});

	// 상품 정보에서 아티스트 ID를 추출하여 아티스트 상세 정보도 가져옴
	const uniqueArtistIds = useMemo(() => {
		const artistIds = new Set<number>();
		productQueries.forEach((query) => {
			if (query.data?.seller?.id) {
				artistIds.add(query.data.seller.id);
			}
		});
		return Array.from(artistIds);
	}, [productQueries]);

	const artistQueries = useQueries({
		queries: uniqueArtistIds.map((artistId) => ({
			...getArtistDetailQueryOption(artistId),
		})),
	});

	// 디버깅을 위한 useEffect 추가
	useEffect(() => {
		console.log("CartPage - cartStoreItems:", cartStoreItems);
		console.log(
			"CartPage - productQueries status:",
			productQueries.map((q) => ({
				isLoading: q.isLoading,
				isError: q.isError,
				isSuccess: q.isSuccess,
				data: q.data,
				error: q.error,
			})),
		);
		console.log("CartPage - uniqueArtistIds:", uniqueArtistIds);
		console.log(
			"CartPage - artistQueries status:",
			artistQueries.map((q) => ({
				isLoading: q.isLoading,
				isError: q.isError,
				isSuccess: q.isSuccess,
				data: q.data,
				error: q.error,
			})),
		);
	}, [cartStoreItems, productQueries, uniqueArtistIds, artistQueries]);

	const { artistsWithItems, checkoutItems, subtotal, total } = useMemo(() => {
		console.log("CartPage - useMemo 실행");
		const detailedCartItems: CartItemWithProductDetails[] = [];
		let calculatedSubtotal = 0;

		// 상품 쿼리가 모두 완료되었는지 확인 (성공 또는 실패)
		const allProductQueriesSettled = productQueries.every((query) => !query.isLoading);

		console.log("CartPage - allProductQueriesSettled:", allProductQueriesSettled);

		if (!allProductQueriesSettled) {
			console.log("CartPage - 제품 쿼리가 아직 완료되지 않음");
			return {
				artistsWithItems: [],
				checkoutItems: [],
				subtotal: 0,
				total: 0,
			};
		}

		// 제품 쿼리는 완료되었으므로 아이템 처리
		for (let i = 0; i < cartStoreItems.length; i++) {
			const cartItem = cartStoreItems[i];
			const productQuery = productQueries[i];
			const product = productQuery?.data;

			if (!cartItem) continue;

			console.log(`CartPage - Processing item ${i}:`, {
				cartItem,
				product,
				queryStatus: {
					isLoading: productQuery?.isLoading,
					isError: productQuery?.isError,
					isSuccess: productQuery?.isSuccess,
					error: productQuery?.error,
				},
			});

			if (product && cartItem) {
				// 라이센스 타입으로 정보 가져오기
				let licenseName = "";
				let licenseDescription = "";
				let licensePrice = 0;

				if (product.licenseInfo && product.licenseInfo.length > 0) {
					// 새로운 구조 사용
					const licenseInfo = product.licenseInfo.find((lic: any) => lic.type === cartItem.licenseType);
					console.log(`CartPage - licenseInfo found:`, licenseInfo);

					if (licenseInfo) {
						const template = LICENSE_MAP_TEMPLATE[licenseInfo.type as keyof typeof LICENSE_MAP_TEMPLATE];
						licenseName = template?.name || licenseInfo.type;
						licenseDescription = template?.description || "";
						licensePrice = licenseInfo.price;
					}
				} else {
					// LICENSE_MAP_TEMPLATE에서 기본 정보 사용
					const template = LICENSE_MAP_TEMPLATE[cartItem.licenseType];
					console.log(`CartPage - template fallback:`, template);

					if (template) {
						licenseName = template.name;
						licenseDescription = template.description;
						// 기본 가격 설정 (실제로는 백엔드에서 가져와야 함)
						licensePrice = cartItem.licenseType === "MASTER" ? 50000 : 30000;
					}
				}

				if (licenseName) {
					detailedCartItems.push({
						id: product.id,
						imageUrl: product.coverImage?.url || "",
						title: product.productName,
						licenseType: cartItem.licenseType,
						licenseName,
						licenseDescription,
						type: product.category === "BEAT" ? "beat" : "acapella",
						price: licensePrice,
					});
					calculatedSubtotal += licensePrice;
				}
			} else if (productQuery?.isError) {
				console.error(`CartPage - Product query error for item ${cartItem.id}:`, productQuery.error);
			}
		}

		console.log("CartPage - detailedCartItems:", detailedCartItems);

		// Group items by artist - seller 정보 사용 (아티스트 상세 정보는 선택적)
		const groupedByArtist: Record<string, ArtistWithCartItems> = {};
		for (const item of detailedCartItems) {
			const productQuery = productQueries.find((q) => q.data?.id === item.id);
			const product = productQuery?.data;

			if (product?.seller) {
				const artistId = product.seller.id;
				const artistName = product.seller.stageName;

				// 아티스트 상세 정보 찾기 (선택적)
				const artistQuery = artistQueries.find((q) => q.data?.id === artistId);
				const artistDetail = artistQuery?.data;

				console.log(`CartPage - Grouping item ${item.id}:`, {
					seller: product.seller,
					artistDetail,
					artistQuery: artistQuery
						? {
								isLoading: artistQuery.isLoading,
								isError: artistQuery.isError,
								isSuccess: artistQuery.isSuccess,
							}
						: null,
				});

				if (!groupedByArtist[artistName]) {
					groupedByArtist[artistName] = {
						artistId: artistId,
						artistName: artistName,
						// 아티스트 상세 정보가 있으면 사용, 없으면 seller 정보 사용
						artistImageUrl: artistDetail?.profileImageUrl || product.seller.profileImageUrl || "",
						items: [],
					};
				}
				groupedByArtist[artistName]?.items.push(item);
			} else {
				console.warn(`CartPage - No seller info for product ${item.id}`);
			}
		}

		const artistsArray = Object.values(groupedByArtist);
		console.log("CartPage - artistsArray:", artistsArray);

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
	}, [cartStoreItems, productQueries, artistQueries]);

	// 로딩 상태 체크
	const isLoading = productQueries.some((query) => query.isLoading);
	const hasProductErrors = productQueries.some((query) => query.isError);
	const hasArtistErrors = artistQueries.some((query) => query.isError);

	// 에러 디버깅 정보 추가
	if (hasProductErrors) {
		console.error(
			"CartPage - Product Query errors:",
			productQueries
				.filter((q) => q.isError)
				.map((q) => ({
					error: q.error,
					message: q.error?.message,
					status: q.error instanceof AxiosError ? q.error.response?.status : undefined,
				})),
		);
	}
	if (hasArtistErrors) {
		console.error(
			"CartPage - Artist Query errors:",
			artistQueries
				.filter((q) => q.isError)
				.map((q) => ({
					error: q.error,
					message: q.error?.message,
					status: q.error instanceof AxiosError ? q.error.response?.status : undefined,
				})),
		);
	}

	if (cartStoreItems.length === 0) {
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
						{/* Skeleton for artist sections */}
						<ArtistSectionSkeleton />
						<ArtistSectionSkeleton />
					</div>
					<div className="sticky rounded-lg h-fit top-20">
						{/* Skeleton for payment detail */}
						<PaymentDetailSkeleton />
					</div>
				</div>
			</div>
		);
	}

	if (hasProductErrors) {
		return (
			<div className="flex flex-col h-full overflow-hidden">
				<div className="flex-shrink-0">
					<CartHeader />
				</div>
				<div className="flex flex-col items-center justify-center flex-1 h-full">
					<p className="text-xl text-red-500">Error loading cart items.</p>
					<div className="mt-4 text-sm text-red-400">
						<p>Product errors:</p>
						{productQueries
							.filter((q) => q.isError)
							.map((query, index) => (
								<p key={`product-${index}`}>
									Product Error {index}: {query.error?.message || "Unknown error"}
									{query.error instanceof AxiosError &&
										query.error.response?.status &&
										` (Status: ${query.error.response.status})`}
								</p>
							))}
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
							<div className="mt-4 text-sm text-gray-400">
								<p>Cart items: {cartStoreItems.length}</p>
								<p>Successful product queries: {productQueries.filter((q) => q.isSuccess).length}</p>
								<p>Failed product queries: {productQueries.filter((q) => q.isError).length}</p>
								<p>Artists found: {artistsWithItems.length}</p>
							</div>
						</div>
					) : (
						artistsWithItems.map((artistData) => (
							<CartArtistSection
								key={artistData.artistId}
								artistId={artistData.artistId}
								artistName={artistData.artistName}
								artistImageUrl={artistData.artistImageUrl}
								items={artistData.items}
							/>
						))
					)}
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
