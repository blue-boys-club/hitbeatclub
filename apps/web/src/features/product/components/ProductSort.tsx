"use client";

import { memo } from "react";
import { SquareDropdown } from "@/components/ui";

interface TrackSortProps {
	onSortChange?: (value: string) => void;
}

/**
 * 좋아요한 트랙 정렬 컴포넌트
 * - Recent, A-Z, Popular 기준으로 정렬 가능
 * - 선택된 정렬 옵션을 상위 컴포넌트에 전달
 */
export const ProductSort = memo(({ onSortChange }: TrackSortProps) => {
	const sortOptions = [
		{ label: "Recent", value: "recent" },
		{ label: "A - Z", value: "alphabetical" },
		{ label: "Popular", value: "popular" },
	];

	return (
		<SquareDropdown
			options={sortOptions}
			defaultValue="recent"
			onChange={onSortChange}
		/>
	);
});

ProductSort.displayName = "ProductSort";
