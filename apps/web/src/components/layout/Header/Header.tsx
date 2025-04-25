import React, { memo } from "react";
import Link from "next/link";
import { cn } from "@/common/utils";
import { Home } from "@/assets/svgs/Home";
import { SearchBar } from "./SearchBar";
import { HeaderNav } from "./HeaderNav";

interface HeaderProps {
	className?: string;
}

const Header = memo(({ className }: HeaderProps) => {
	return (
		<header
			className={cn(
				"w-[calc(100vw-237px)] bg-white z-5",
				"fixed top-0 right-0 z-10 border-0 border-b-[8px] px-5 py-3 mb-0",
				"flex items-center gap-7 justify-between shrink-0",
				"transition-all duration-300",
				className,
			)}
		>
			<div className={cn("flex items-center gap-7 flex-1")}>
				<Link href={"/"}>
					<Home />
				</Link>
				<SearchBar />
			</div>
			<HeaderNav />
		</header>
	);
});

Header.displayName = "Header";

export default Header;
