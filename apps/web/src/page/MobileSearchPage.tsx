"use client";

import { Search } from "@/assets/svgs";
import { cn } from "@/common/utils";
import { MobileProductItem, MobileProductListFilter } from "@/features/mobile/product/components";
import { MobileBuyOrCartModal } from "@/features/mobile/search/modals";
import { useState, useRef, useEffect } from "react";

const MobileSearchPage = () => {
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const inputRef = useRef<HTMLInputElement>(null);
	const [isOpenBuyOrCartModal, setIsOpenBuyOrCartModal] = useState(false);
	const [isShowFilter, setIsShowFilter] = useState(false);

	// 임시 자동완성 데이터 (실제로는 API나 데이터베이스에서 가져와야 함)
	const mockSuggestions = [
		"Hip Hop Beat",
		"Pop Instrumental",
		"Jazz Vocals",
		"R&B Acapella",
		"Electronic Dance",
		"Rock Guitar",
		"Classical Piano",
		"Reggae Rhythm",
		"Country Guitar",
		"Blues Harmonica",
	];

	const filteredSuggestions =
		searchQuery.trim() === ""
			? []
			: mockSuggestions.filter((suggestion) => suggestion.toLowerCase().includes(searchQuery.toLowerCase()));

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchQuery(value);
		setSelectedIndex(-1);

		// 검색어가 있으면 자동완성 표시
		setShowSuggestions(value.trim() !== "");
	};

	const handleSuggestionClick = (suggestion: string) => {
		setSearchQuery(suggestion);
		setShowSuggestions(false);
		setSelectedIndex(-1);
		inputRef.current?.focus();
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
		if (!showSuggestions || filteredSuggestions.length === 0) return;

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
				}
				break;
			case "Escape":
				setShowSuggestions(false);
				setSelectedIndex(-1);
				break;
		}
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
								{filteredSuggestions.map((suggestion, index) => (
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
								))}
							</div>
						)}

						{/* 검색 결과 없음 */}
						{showSuggestions && filteredSuggestions.length === 0 && searchQuery.trim() !== "" && (
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
				{!searchQuery ? (
					<div className="w-full h-full flex flex-col justify-center items-center gap-2 text-16px font-semibold leading-140%">
						<span>검색어를 입력해주세요</span>
						<span className="font-[450]">Search your keywords</span>
					</div>
				) : (
					<div className="flex flex-col gap-3">
						<div className="h-40px border-b-6px border-black flex justify-between">
							<span className="font-bold text-22px leading-24px">Search Results</span>
							<button
								className="h-24px rounded-40px bg-[#dadada] px-2 font-semibold text-14px leading-16px"
								onClick={() => {
									setIsShowFilter(true);
								}}
							>
								Filters <span className="text-18px">+</span>
							</button>
						</div>
						<div
							className="flex flex-col gap-2"
							onClick={() => {
								setIsOpenBuyOrCartModal(true);
							}}
						>
							<MobileProductItem />
							<MobileProductItem />
							<MobileProductItem />
							<MobileProductItem />
							<MobileProductItem />
							<MobileProductItem />
							<MobileProductItem />
							<MobileProductItem />
							<MobileProductItem />
							<MobileProductItem />
							<MobileProductItem />
						</div>
					</div>
				)}
			</div>
			<MobileBuyOrCartModal
				isOpen={isOpenBuyOrCartModal}
				onClose={() => setIsOpenBuyOrCartModal(false)}
			/>
			{isShowFilter && <MobileProductListFilter onClose={() => setIsShowFilter(false)} />}
		</div>
	);
};

export default MobileSearchPage;
