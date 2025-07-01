"use client";

import { useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { useState } from "react";
import { HeartFilled } from "@/assets/svgs";
import { MobileMyPageTitle } from "@/features/mobile/my/components";
import { MobileProductItem } from "@/features/mobile/product/components";
import { MobileBuyOrCartModal } from "@/features/mobile/search/modals";
import { getLikedProductsQueryOption } from "@/apis/user/query/user.query-option";
import { useAuthStore } from "@/stores/auth";
import { ProductLikeResponse } from "@hitbeatclub/shared-types";

export const MobileMyLikePage = () => {
	// 현재 사용자 ID 가져오기
	const userId = useAuthStore(useShallow((state) => state.user?.userId));

	// 모달 상태 관리
	const [isOpenBuyOrCartModal, setIsOpenBuyOrCartModal] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<any>(null);

	// Buy/Cart 모달 열기 핸들러
	const handleBuyClick = (product: any) => {
		setSelectedProduct(product);
		setIsOpenBuyOrCartModal(true);
	};

	// 좋아요한 제품 목록 조회
	const {
		data: products,
		isLoading,
		error,
	} = useQuery(
		getLikedProductsQueryOption(userId!, {
			page: 1,
			limit: 50,
			sort: "RECENT",
		}),
	);

	// 로딩 상태
	if (isLoading) {
		return (
			<div className="flex flex-col">
				<MobileMyPageTitle
					icon={<HeartFilled />}
					title="Like"
					right="Loading..."
				/>
				<div className="flex justify-center p-8">
					<span className="text-gray-500">로딩 중...</span>
				</div>
			</div>
		);
	}

	// 에러 상태
	if (error) {
		return (
			<div className="flex flex-col">
				<MobileMyPageTitle
					icon={<HeartFilled />}
					title="Like"
					right="Error"
				/>
				<div className="flex justify-center p-8">
					<span className="text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</span>
				</div>
			</div>
		);
	}

	// 로그인하지 않은 경우
	if (!userId) {
		return (
			<div className="flex flex-col">
				<MobileMyPageTitle
					icon={<HeartFilled />}
					title="Like"
					right="0 Items"
				/>
				<div className="flex justify-center p-8">
					<span className="text-gray-500">로그인이 필요합니다.</span>
				</div>
			</div>
		);
	}

	// products는 이미 배열 형태
	const productList = products || [];
	const totalCount = productList.length;

	return (
		<div className="flex flex-col">
			<MobileMyPageTitle
				icon={<HeartFilled />}
				title="Like"
				right={`${totalCount} Items`}
			/>
			<div className="flex flex-col gap-2">
				{productList.length > 0 ? (
					productList.map((product: ProductLikeResponse) => (
						<MobileProductItem
							key={product.id}
							type="like"
							product={product}
						/>
					))
				) : (
					<div className="flex justify-center p-8">
						<span className="text-gray-500">좋아요한 제품이 없습니다.</span>
					</div>
				)}
			</div>
			{selectedProduct && (
				<MobileBuyOrCartModal
					isOpen={isOpenBuyOrCartModal}
					onClose={() => {
						setIsOpenBuyOrCartModal(false);
						setSelectedProduct(null);
					}}
					product={selectedProduct}
				/>
			)}
		</div>
	);
};
