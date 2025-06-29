"use client";

import { useState, memo } from "react";
import { SearchTag } from "@/components/ui/SearchTag";

interface TrackSearchProps {
	onSearch?: (value: string) => void;
}

/**
 * 좋아요한 트랙 검색 컴포넌트
 * - 실시간 검색어 입력 처리
 * - 검색어 변경 시 상위 컴포넌트에 알림
 */
export const ProductSearch = memo(({ onSearch }: TrackSearchProps) => {
	// 내부 입력값 상태를 분리하여 Enter(또는 검색 아이콘)로 확정될 때만 onSearch 콜백을 실행합니다.
	const [inputValue, setInputValue] = useState("");

	// 입력 변경 시 내부 상태만 업데이트합니다.
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	// 검색 확정(Enter 또는 아이콘 클릭) 시 외부로 알립니다.
	const triggerSearch = (value?: string) => {
		onSearch?.(value ?? inputValue);
	};

	return (
		<SearchTag
			wrapperClassName="w-[146px]"
			className="placeholder:text-[--hbc-gray] placeholder:font-medium"
			placeholder="Search"
			value={inputValue}
			onChange={handleInputChange}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					e.preventDefault();
					triggerSearch();
				}
			}}
			onSearch={triggerSearch}
		/>
	);
});

ProductSearch.displayName = "ProductSearch";
