import { Search } from "@/assets/svgs";
import { Home } from "@/assets/svgs/Home";
import { Star } from "@/assets/svgs/Star";
import { cn } from "@/common/utils";
import { useState } from "react";

// 모바일 전용
export const FooterNav = () => {
	const [currentTab, setCurrentTab] = useState("my");
	const tabs = [
		{
			id: "my",
			icon: (
				<Star
					width="28"
					height="28"
					fill={currentTab === "my" ? "black" : "#BBBBBF"}
				/>
			),
			label: "MY",
		},
		{
			id: "home",
			icon: (
				<Home
					width="24"
					height="24"
					fill={currentTab === "home" ? "black" : "#BBBBBF"}
				/>
			),
			label: "HOME",
		},
		{
			id: "search",
			icon: (
				<Search
					width="24"
					height="24"
					fill={currentTab === "search" ? "black" : "#BBBBBF"}
				/>
			),
			label: "SEARCH",
		},
	];
	return (
		<nav className="bg-white flex items-center gap-4 h-72px px-6 border-t-4px">
			{tabs.map((tab) => (
				<button
					key={tab.id}
					className="flex-1 flex flex-col items-center gap-1"
					onClick={() => setCurrentTab(tab.id)}
				>
					<div className="flex justify-center items-center w-8 h-8">{tab.icon}</div>
					<span className={cn("text-[10px] leading-12px", currentTab === tab.id ? "text-black" : "text-[#BBBBBF]")}>
						{tab.label}
					</span>
				</button>
			))}
		</nav>
	);
};
