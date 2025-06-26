"use client";

import { Search } from "@/assets/svgs";
import { cn } from "@/common/utils";
import { MobileProductItem, MobileProductListFilter } from "@/features/mobile/product/components";
import { MobileBuyOrCartModal } from "@/features/mobile/search/modals";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSearchQueryOption, getAutocompleteSearchQueryOption } from "@/apis/search/query/product.query-option";
import { ProductSearchQuery } from "@/apis/search/search.type";

const MobileSearchPage = () => {
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedAutocompleteQuery, setDebouncedAutocompleteQuery] = useState("");
	const [executedSearchQuery, setExecutedSearchQuery] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const inputRef = useRef<HTMLInputElement>(null);
	const [isOpenBuyOrCartModal, setIsOpenBuyOrCartModal] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<any>(null);
	const [isShowFilter, setIsShowFilter] = useState(false);
	const [searchFilters, setSearchFilters] = useState<Partial<ProductSearchQuery>>({});

	// Buy/Cart 모달 열기 핸들러
	const handleBuyClick = (product: any) => {
		setSelectedProduct(product);
		setIsOpenBuyOrCartModal(true);
	};

	// 자동완성용 디바운스 (300ms)
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedAutocompleteQuery(searchQuery);
		}, 300);

		return () => clearTimeout(timer);
	}, [searchQuery]);

	// 검색 실행 함수
	const executeSearch = (query: string) => {
		setExecutedSearchQuery(query);
		setShowSuggestions(false);
		setSelectedIndex(-1);
	};

	// 검색 키워드와 필터를 기반으로 한 검색 쿼리 생성
	const searchQueryParams: ProductSearchQuery = {
		keyword: executedSearchQuery.trim() || undefined,
		page: 1,
		limit: 20,
		...searchFilters,
	};

	// 자동완성 검색 쿼리
	const { data: autocompleteData, isLoading: isAutocompleteLoading } = useQuery({
		...getAutocompleteSearchQueryOption(debouncedAutocompleteQuery),
		enabled: !!debouncedAutocompleteQuery.trim() && debouncedAutocompleteQuery.trim().length > 0,
	});

	// 검색 결과 가져오기
	const {
		data: searchResults,
		isLoading,
		error,
	} = useQuery({
		...getSearchQueryOption(searchQueryParams),
		enabled: !!executedSearchQuery.trim(), // 실행된 검색어가 있을 때만 실행
	});

	// 자동완성 결과 처리 - 표시용 텍스트 추출
	const filteredSuggestions: string[] = (autocompleteData || []).map((item: any) => {
		if (item.type === "PRODUCT") {
			return item.productName;
		} else {
			return item.stageName;
		}
	});

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchQuery(value);
		setSelectedIndex(-1);

		// 검색어가 있으면 자동완성 표시
		setShowSuggestions(value.trim() !== "");
	};

	const handleSuggestionClick = (suggestion: string) => {
		setSearchQuery(suggestion);
		executeSearch(suggestion); // 자동완성 클릭 시 바로 검색 실행
	};

	const handleSearchFocus = () => {
		setIsSearchFocused(true);
		if (searchQuery.trim() !== "") {
			setShowSuggestions(true);
		}
	};

	const handleSearchBlur = () => {
		setIsSearchFocused(false);
		// 약간의 지연을 두어 클릭 이벤트가 처리되도록 함
		setTimeout(() => {
			setShowSuggestions(false);
			setSelectedIndex(-1);
		}, 200);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (!showSuggestions || filteredSuggestions.length === 0) {
			// 자동완성이 없을 때 엔터키 처리
			if (e.key === "Enter") {
				e.preventDefault();
				executeSearch(searchQuery);
			}
			return;
		}

		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				setSelectedIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : prev));
				break;
			case "ArrowUp":
				e.preventDefault();
				setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
				break;
			case "Enter":
				e.preventDefault();
				if (selectedIndex >= 0 && filteredSuggestions[selectedIndex]) {
					handleSuggestionClick(filteredSuggestions[selectedIndex]);
				} else if (filteredSuggestions.length > 0 && filteredSuggestions[0]) {
					handleSuggestionClick(filteredSuggestions[0]);
				} else {
					executeSearch(searchQuery);
				}
				break;
			case "Escape":
				setShowSuggestions(false);
				setSelectedIndex(-1);
				break;
		}
	};

	// 필터 적용 핸들러
	const handleApplyFilter = (filters: Partial<ProductSearchQuery>) => {
		setSearchFilters(filters);
	};

	// 선택된 인덱스가 변경될 때마다 스크롤 위치 조정
	useEffect(() => {
		if (selectedIndex >= 0) {
			const selectedElement = document.querySelector(`[data-suggestion-index="${selectedIndex}"]`) as HTMLElement;
			selectedElement?.scrollIntoView({ block: "nearest" });
		}
	}, [selectedIndex]);

	return (
		<div>
			<div className="fixed top-0 left-0 right-0 z-10">
				<div className="h-62px px-4 flex items-center bg-white">
					<div className="w-full h-29px border-l-2px border-r-2px border-black px-3 flex items-center gap-2 relative">
						<Search
							className={cn("w-19px h-19px")}
							fill={isSearchFocused ? "black" : "#bdbdbd"}
						/>
						<input
							ref={inputRef}
							className="w-full text-16px leading-16px font-[450] placeholder:text-hbc-gray focus:outline-none"
							placeholder="Search for artists, beats, a cappellas"
							value={searchQuery}
							onChange={handleSearchChange}
							onFocus={handleSearchFocus}
							onBlur={handleSearchBlur}
							onKeyDown={handleKeyDown}
						/>

						{/* 자동완성 리스트 */}
						{showSuggestions && filteredSuggestions.length > 0 && (
							<div className="border-l-2px border-r-2px border-black absolute top-full -left-2px -right-2px mt-3 bg-white z-20 max-h-80 overflow-y-auto">
								{isAutocompleteLoading ? (
									<div className="h-29px px-3 flex items-center text-16px leading-16px font-[450] text-gray-500">
										검색 중...
									</div>
								) : (
									filteredSuggestions.map((suggestion: string, index: number) => (
										<div
											key={index}
											data-suggestion-index={index}
											className={cn(
												"h-29px px-3 flex items-center cursor-pointer text-16px leading-16px font-[450]",
												selectedIndex === index ? "bg-blue-50" : "hover:bg-gray-50",
											)}
											onClick={() => handleSuggestionClick(suggestion)}
										>
											{suggestion}
										</div>
									))
								)}
							</div>
						)}

						{/* 검색 결과 없음 */}
						{showSuggestions &&
							filteredSuggestions.length === 0 &&
							searchQuery.trim() !== "" &&
							!isAutocompleteLoading && (
								<div className="absolute top-full -left-2px -right-2px mt-3 bg-white z-20">
									<div className="h-29px border-l-2px border-r-2px border-black px-3 flex items-center text-16px leading-16px font-[450] text-gray-500">
										No results found
									</div>
								</div>
							)}
					</div>
				</div>
			</div>
			<div className="pt-62px px-16px pb-16px h-[calc(100vh-142px)] overflow-y-auto">
				{!executedSearchQuery ? (
					<div className="w-full h-full flex flex-col justify-center items-center gap-2 text-16px font-semibold leading-140%">
						<span>검색어를 입력해주세요</span>
						<span className="font-[450]">Search your keywords</span>
					</div>
				) : (
					<div className="flex flex-col gap-3">
						<div className="h-40px border-b-6px border-black flex justify-between">
							<span className="font-bold text-22px leading-24px">
								Search Results ({searchResults?.products.length || 0})
							</span>
							<button
								className="h-24px rounded-40px bg-[#dadada] px-2 font-semibold text-14px leading-16px"
								onClick={() => {
									setIsShowFilter(true);
								}}
							>
								Filters <span className="text-18px">+</span>
							</button>
						</div>

						{isLoading ? (
							<div className="flex justify-center py-8">
								<span className="text-16px">검색 중...</span>
							</div>
						) : error ? (
							<div className="flex justify-center py-8">
								<span className="text-16px text-red-500">검색 중 오류가 발생했습니다.</span>
							</div>
						) : searchResults?.products.length === 0 ? (
							<div className="flex justify-center py-8">
								<span className="text-16px">검색 결과가 없습니다.</span>
							</div>
						) : (
							<div className="flex flex-col gap-2">
								{searchResults?.products.map((product) => (
									<MobileProductItem
										key={product.id}
										type="search"
										product={product}
										onBuyClick={handleBuyClick}
									/>
								))}
							</div>
						)}
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
			{isShowFilter && (
				<MobileProductListFilter
					onClose={() => setIsShowFilter(false)}
					onApplyFilter={handleApplyFilter}
					initialFilters={searchFilters}
				/>
			)}
		</div>
	);
};

export default MobileSearchPage;
