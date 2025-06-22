"use client";

import React, { useState, useCallback, useEffect, Suspense, useMemo, useRef } from "react";
import { Search } from "@/assets/svgs/Search";
import { cn } from "@/common/utils";
import { TagDropdown } from "@/components/ui";
import { Input } from "@/components/ui/Input";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParametersStateByKey } from "@/features/search/hooks/useSearchParameters";
import { useQuery } from "@tanstack/react-query";
import { getAutocompleteSearchQueryOption } from "@/apis/search/query/product.query-option";

interface SearchOption {
	label: string;
	value: string;
	type?: "PRODUCT" | "ARTIST";
	id?: number;
}

export const SearchBar = () => {
	return (
		<Suspense fallback={null}>
			<SearchBarClient />
		</Suspense>
	);
};

export const SearchBarClient = () => {
	const router = useRouter();
	const pathname = usePathname();
	const isSearch = pathname === "/search";
	const [searchValue, setSearchValue] = useSearchParametersStateByKey("keyword");
	const [debouncedSearchValue, setDebouncedSearchValue] = useState("");

	// 디바운스된 검색어로 자동완성 쿼리 실행
	const { data: autocompleteData } = useQuery(getAutocompleteSearchQueryOption(debouncedSearchValue));

	// 자동완성 데이터를 SearchOption 형태로 변환
	const searchOptions: SearchOption[] = useMemo(() => {
		if (!autocompleteData || !Array.isArray(autocompleteData)) return [];

		return autocompleteData.map((item: any) => {
			if (item.type === "PRODUCT") {
				return {
					label: item.productName || "",
					value: item.productName || "",
					type: "PRODUCT",
					id: item.id,
				};
			} else {
				return {
					label: item.stageName || "",
					value: item.stageName || "",
					type: "ARTIST",
					id: item.id,
				};
			}
		});
	}, [autocompleteData]);

	// 디바운스를 위한 타이머 ref
	const debounceTimer = useRef<NodeJS.Timeout | null>(null);

	// 디바운스된 검색어 업데이트 함수
	const updateDebouncedSearch = useCallback((value: string) => {
		if (debounceTimer.current) {
			clearTimeout(debounceTimer.current);
		}
		debounceTimer.current = setTimeout(() => {
			setDebouncedSearchValue(value);
		}, 500);
	}, []);

	const navigateToSearch = useCallback(() => {
		if (!searchValue) return;

		const url = new URL(window.location.href);
		url.pathname = "/search";
		url.searchParams.set("keyword", searchValue);
		router.push(url.toString());
	}, [router, searchValue]);

	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			setSearchValue(value);

			// 자동완성을 위한 디바운스된 검색어 업데이트
			updateDebouncedSearch(value);
		},
		[setSearchValue, updateDebouncedSearch],
	);

	const handleSearchSubmit = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			const inputValue = e.currentTarget.querySelector("input")?.value ?? "";
			setSearchValue(inputValue);
			if (!isSearch) {
				navigateToSearch();
			}
		},
		[isSearch, navigateToSearch, setSearchValue],
	);

	const handleSearchOptionSelect = useCallback(
		(value: string) => {
			setSearchValue(value);
			if (!isSearch) {
				navigateToSearch();
			}
		},
		[isSearch, navigateToSearch, setSearchValue],
	);

	useEffect(() => {
		if (!isSearch && searchValue) {
			// preload search page
			router.prefetch(`/search?search=${searchValue}`);
		}
	}, [isSearch, router, searchValue]);

	return (
		<TagDropdown
			wrapperClassName="w-full"
			className="w-full"
			optionsClassName={cn(
				"rounded-none p-3 border-[6px] border-b-black border-x-0 border-t-0 rounded-b-[5px]",
				searchOptions.length === 0 && "hidden",
			)}
			showChevron={false}
			options={searchOptions.map((option) => ({
				...option,
				className: cn(
					"rounded-[5px] text-base font-bold leading-4",
					option.type === "ARTIST" && "text-blue-600", // 아티스트는 파란색으로 구분
				),
			}))}
			onSelect={handleSearchOptionSelect}
		>
			<form
				className="relative flex items-center w-full"
				onSubmit={handleSearchSubmit}
			>
				<Search
					className="absolute left-3 text-[#BDBDBD] pointer-events-none"
					aria-hidden="true"
				/>
				<Input
					className={cn(
						"border-0 border-l-[2px] outline-none rounded-none",
						"w-full min-w-80 pl-9 py-1 pr-1",
						"placeholder:text-[#BDBDBD] placeholder:text-base placeholder:font-normal placeholder:leading-4",
					)}
					placeholder="Search for artists, beats, a cappellas"
					value={searchValue ?? ""}
					onChange={handleSearchChange}
				/>
			</form>
		</TagDropdown>
	);
};
