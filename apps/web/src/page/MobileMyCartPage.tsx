"use client";

import { Cart } from "@/assets/svgs";
import { MobileMyPageTitle } from "@/features/mobile/my/components";
import { MobileMyCartItem } from "@/features/mobile/my/components";
import { PaymentMethodModal } from "@/features/mobile/my/components/modals";
import { useToast } from "@/hooks/use-toast";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCartListQueryOptions, getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { Checkbox } from "@/components/ui";
import { type CheckoutItem } from "@/features/cart/components/modal/PaymentSelectModal";

// 로딩 스켈레톤 컴포넌트
const CartItemSkeleton = () => (
	<div className="bg-[#dadada] p-2 rounded-5px flex justify-between items-center animate-pulse">
		<div className="flex gap-2">
			<div className="w-50px h-50px rounded-5px bg-gray-300" />
			<div className="flex flex-col gap-10px items-start">
				<div className="flex flex-col gap-1">
					<div className="w-20 h-3 bg-gray-300 rounded" />
					<div className="w-16 h-2 bg-gray-300 rounded" />
				</div>
				<div className="w-16 h-3 bg-gray-300 rounded" />
			</div>
		</div>
		<div className="flex gap-2 items-center">
			<div className="w-16 h-2 bg-gray-300 rounded" />
			<div className="w-2 h-2 bg-gray-300 rounded" />
		</div>
	</div>
);

export const MobileMyCartPage = () => {
	const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
	const [isAgreed, setIsAgreed] = useState(false);
	const { toast } = useToast();

	// 사용자 정보 가져오기
	const { data: user } = useQuery(getUserMeQueryOption());

	// 장바구니 데이터 가져오기
	const {
		data: cartItems,
		isLoading,
		isError,
		error,
	} = useQuery({
		...useCartListQueryOptions(user?.id ?? 0),
		enabled: !!user?.id,
	});

	// 총 가격 계산 및 checkoutItems 준비
	const { totalPrice, itemCount, checkoutItems, orderName } = useMemo(() => {
		if (!cartItems) {
			return { totalPrice: 0, itemCount: 0, checkoutItems: [] as CheckoutItem[], orderName: "" };
		}

		const total = (cartItems ?? []).reduce((sum, item) => sum + (item.selectedLicense?.price || 0), 0);

		const items: CheckoutItem[] = (cartItems ?? []).map((item) => ({
			productId: item.product.id,
			licenseId: item.selectedLicense?.id || 0,
			imageUrl: item.product.coverImage?.url || "",
			title: item.product.productName,
			price: item.selectedLicense?.price || 0,
		}));

		const orderNameStr =
			items.length > 0 ? `${items[0]?.title || "상품"}${items.length > 1 ? ` 외 ${items.length - 1}개` : ""}` : "";

		return {
			totalPrice: total,
			itemCount: (cartItems ?? []).length,
			checkoutItems: items,
			orderName: orderNameStr,
		};
	}, [cartItems]);

	const handleCheckoutClick = () => {
		if (!cartItems || cartItems.length === 0) {
			toast({ description: "장바구니가 비어있습니다." });
			return;
		}
		if (!isAgreed) {
			toast({ description: "결제 약관에 동의해주세요." });
			return;
		}
		setIsPaymentModalOpen(true);
	};

	const handleCloseModal = (open: boolean) => {
		setIsPaymentModalOpen(open);
	};

	const handlePaymentComplete = () => {
		toast({ description: "결제가 완료되었습니다." });
	};

	const handlePaymentError = (error: { message: string; code: string }) => {
		toast({ description: error.message, variant: "destructive" });
	};

	// 로딩 상태
	if (isLoading) {
		return (
			<div className="h-full flex flex-col justify-between">
				<div>
					<MobileMyPageTitle
						icon={
							<Cart
								width="20px"
								height="25px"
							/>
						}
						title="My Cart"
						right="Loading..."
					/>
					<div className="flex flex-col gap-2">
						{Array.from({ length: 3 }, (_, index) => (
							<CartItemSkeleton key={index} />
						))}
					</div>
				</div>
			</div>
		);
	}

	// 에러 상태
	if (isError) {
		return (
			<div className="h-full flex flex-col justify-center items-center">
				<div className="text-center">
					<p className="text-red-500 mb-4">장바구니를 불러오는데 실패했습니다.</p>
					<p className="text-sm text-gray-500">{error?.message}</p>
				</div>
			</div>
		);
	}

	// 빈 장바구니 상태
	if (!cartItems || cartItems.length === 0) {
		return (
			<div className="h-full flex flex-col justify-between">
				<div>
					<MobileMyPageTitle
						icon={
							<Cart
								width="20px"
								height="25px"
							/>
						}
						title="My Cart"
						right="0 Items"
					/>
					<div className="flex flex-col items-center justify-center py-20">
						<Cart
							width="60px"
							height="60px"
							className="opacity-30 mb-4"
						/>
						<p className="text-gray-500 text-center">
							장바구니가 비어있습니다.
							<br />
							음원을 추가해보세요!
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col justify-between">
			<div>
				<MobileMyPageTitle
					icon={
						<Cart
							width="20px"
							height="25px"
						/>
					}
					title="My Cart"
					right={`${itemCount} Items`}
				/>
				<div className="flex flex-col gap-2">
					{(cartItems ?? []).map((item) => (
						<MobileMyCartItem
							key={item.id}
							title={item.product.productName}
							artist={item.product.seller?.stageName || "Unknown Artist"}
							imageUrl={item.product.coverImage?.url || ""}
							price={item.selectedLicense?.price || 0}
							licenseType={item.selectedLicense?.type || "Unknown"}
							cartItemId={item.id}
							userId={user?.id || 0}
							productId={item.product.id}
						/>
					))}
				</div>
			</div>
			<div className="flex flex-col gap-4 border-t-4px border-black">
				<div className="mt-10px flex justify-between font-semibold leading-100%">
					<span className="">Total ({itemCount} Items)</span>
					<span className="text-hbc-gray-300">{totalPrice.toLocaleString()} KRW</span>
				</div>
				<div className="flex flex-col">
					<div className="flex flex-col gap-10px">
						<span className="font-semibold text-9px leading-100%">
							디지털 음원 구매 후, 다운로드 또는 스트리밍을 시작하지 않은 경우에
							<br />
							한해 구매일로부터 7일 이내 환불 요청이 가능합니다.
						</span>
						<div className="flex gap-6px items-center">
							<Checkbox
								checked={isAgreed}
								onChange={() => setIsAgreed((prev) => !prev)}
							/>
							<span className="font-semibold text-9px leading-16px">
								결제 관련 이용약관을 확인하였으며, 이에 동의합니다.
							</span>
						</div>
						<button
							onClick={handleCheckoutClick}
							className="h-10 rounded-5px bg-black text-white font-semibold text-16px leading-100%"
						>
							Checkout
						</button>
					</div>
				</div>
			</div>

			<PaymentMethodModal
				isOpen={isPaymentModalOpen}
				onClose={handleCloseModal}
				total={totalPrice}
				orderName={orderName}
				checkoutItems={checkoutItems}
				onPaymentComplete={handlePaymentComplete}
				onPaymentError={handlePaymentError}
			/>
		</div>
	);
};
