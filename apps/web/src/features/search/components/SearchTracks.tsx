"use client";

import { useCallback, useEffect, useRef } from "react";
import { SearchTrackItem } from "./SearchTrackItem";
import { useSearchInfiniteQuery } from "../hooks/useSearchInfiniteQuery";

export const SearchTracks = () => {
	const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useSearchInfiniteQuery();

	// Intersection Observer를 위한 ref
	const observerRef = useRef<HTMLDivElement>(null);

	// 모든 페이지의 products를 플랫화
	const allProducts = data?.pages?.flatMap((page) => page?.products || []) || [];

	// Intersection Observer 콜백
	const handleObserver = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const target = entries[0];
			if (target?.isIntersecting && hasNextPage && !isFetchingNextPage) {
				fetchNextPage();
			}
		},
		[hasNextPage, isFetchingNextPage, fetchNextPage],
	);

	// Intersection Observer 설정
	useEffect(() => {
		const element = observerRef.current;
		if (!element) return;

		const observer = new IntersectionObserver(handleObserver, {
			threshold: 0.1,
		});

		observer.observe(element);

		return () => observer.disconnect();
	}, [handleObserver]);

	if (isLoading) {
		return (
			<div className="flex flex-col gap-2.5 mb-3">
				{Array.from({ length: 10 }).map((_, index) => (
					<div
						key={index}
						className="w-full h-20 bg-gray-200 animate-pulse rounded"
					/>
				))}
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2.5 mb-3">
			{allProducts.map((product: any, index: number) => (
				<SearchTrackItem
					key={`${product.id}-${index}` || index}
					title={product.productName}
					artist={product.seller?.stageName || product.seller?.name}
					albumImgSrc={product.coverImage?.fileUrl}
					tags={product.productTag?.map((tag: any) => tag.tag?.name).filter(Boolean) || []}
				/>
			))}

			{/* Intersection Observer 타겟 */}
			{hasNextPage && (
				<div
					ref={observerRef}
					className="w-full h-10 flex items-center justify-center"
				>
					{isFetchingNextPage && (
						<div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
					)}
				</div>
			)}
		</div>
	);
};
