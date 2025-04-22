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
export const TrackSearch = memo(({ onSearch }: TrackSearchProps) => {
	const [searchTerm, setSearchTerm] = useState("");

	const onChange = (value: string) => {
		setSearchTerm(value);
		onSearch?.(value);
	};

	return (
		<SearchTag
			wrapperClassName="w-[146px]"
			className="placeholder:text-[--hbc-gray] placeholder:font-medium"
			placeholder="Search"
			value={searchTerm}
			onChange={(e) => onChange(e.target.value)}
		/>
	);
});

TrackSearch.displayName = "TrackSearch";
