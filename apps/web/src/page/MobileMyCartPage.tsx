"use client";

import { Cart } from "@/assets/svgs";
import { MobileMyPageTitle } from "@/features/mobile/my/components";
import { MobileMyCartItem } from "@/features/mobile/my/components";
import { PaymentMethodModal } from "@/features/mobile/my/components/modals";
import { useToast } from "@/hooks/use-toast";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCartListQueryOptions, getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { useDeleteCartItemMutation } from "@/apis/user/mutations";

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

	// 총 가격 계산
	const { totalPrice, itemCount } = useMemo(() => {
		if (!cartItems) {
			return { totalPrice: 0, itemCount: 0 };
		}

		const total = cartItems.reduce((sum, item) => sum + item.selectedLicense.price, 0);
		return {
			totalPrice: total,
			itemCount: cartItems.length,
		};
	}, [cartItems]);

	const handleCheckoutClick = () => {
		if (!cartItems || cartItems.length === 0) {
			toast({ description: "장바구니가 비어있습니다." });
			return;
		}
		setIsPaymentModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsPaymentModalOpen(false);
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
					{cartItems.map((item) => (
						<MobileMyCartItem
							key={item.id}
							title={item.product.productName}
							artist={item.product.seller?.stageName || "Unknown Artist"}
							imageUrl={item.product.coverImage?.url || "https://street-h.com/wp-content/uploads/2023/03/hanroro.jpg"}
							price={item.selectedLicense.price}
							licenseType={item.selectedLicense.type}
							cartItemId={item.id}
							userId={user?.id || 0}
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
							<div className="w-11px h-11px rounded-2px bg-hbc-gray-400" />
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
			/>
		</div>
	);
};
