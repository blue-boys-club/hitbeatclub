"use client";

import React, { memo } from "react";
import Link from "next/link";
import { cn } from "@/common/utils";
import { Home } from "@/assets/svgs/Home";
import { SearchBar } from "./SearchBar";
import { HeaderNav } from "./HeaderNav";
import { useDevice } from "@/hooks/use-device";
import { UserProfile } from "@/assets/svgs";
import { Bell } from "@/assets/svgs/Bell";
import { ArrowLeftShort } from "@/assets/svgs/ArrowLeftShort";

const Header = memo(() => {
	const { isPC } = useDevice();
	return isPC ? <PCHeader /> : <MobileHeader />;
});

Header.displayName = "Header";

export default Header;

const PCHeader = () => {
	return (
		<header
			className={cn(
				"w-[calc(100vw-237px)] bg-white z-5",
				"fixed top-0 right-0 z-10 border-0 border-b-[8px] px-5 py-3 mb-0",
				"flex items-center gap-7 justify-between shrink-0",
				"transition-all duration-300",
			)}
		>
			<div className="flex items-center gap-7 flex-1">
				<Link href="/">
					<Home />
				</Link>
				<SearchBar />
			</div>
			<HeaderNav />
		</header>
	);
};

const MobileHeader = () => {
	return (
		<header className={cn("bg-white px-4 w-full h-62px flex justify-between items-center")}>
			<div className="relative border-3px border-hbc-red rounded-40px pl-10px pr-30px py-6px">
				<span className="block text-hbc-red font-bold leading-14px">ARTIST STUDIO</span>
				<button className="absolute top-1/2 right-2px -translate-y-1/2 w-6 h-6 flex justify-center items-center">
					<ArrowLeftShort fill="red" />
				</button>
			</div>
			<div className="flex gap-4 items-center">
				<button className="flex justify-center items-center w-30px h-30px">
					<Bell />
				</button>
				<button className="flex justify-center items-center w-30px h-30px">
					<UserProfile />
				</button>
			</div>
		</header>
	);
};
