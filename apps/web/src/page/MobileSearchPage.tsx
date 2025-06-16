"use client";

import { Search } from "@/assets/svgs";
import { cn } from "@/common/utils";
import { useState } from "react";

const MobileSearchPage = () => {
	const [isSearchFocused, setIsSearchFocused] = useState(false);

	return (
		<div>
			<div className="fixed top-0 left-0 right-0">
				<div className="h-62px px-4 flex items-center">
					<div className="w-full h-29px border-l-2px border-r-2px border-black px-3 flex items-center gap-2">
						<Search
							className={cn("w-19px h-19px")}
							fill={isSearchFocused ? "black" : "#bdbdbd"}
						/>
						<input
							className="w-full text-16px leading-16px font-[450] placeholder:text-hbc-gray focus:outline-none"
							placeholder="Search for artists, beats, a cappellas"
							onFocus={() => setIsSearchFocused(true)}
							onBlur={() => setIsSearchFocused(false)}
						/>
					</div>
				</div>
			</div>
			<div className="pt-78px px-16px pb-16px min-h-[calc(100vh-72px)]"></div>
		</div>
	);
};

export default MobileSearchPage;
