import { Search } from "@/assets/svgs";
import { Home } from "@/assets/svgs/Home";
import { Star } from "@/assets/svgs/Star";
import { cn } from "@/common/utils";
import { usePathname, useRouter } from "next/navigation";

// 모바일 전용
export const FooterNav = () => {
	const pathname = usePathname();
	const router = useRouter();

	const isMyActive = pathname.startsWith("/mobile/my");
	const isHomeActive = pathname.startsWith("/mobile/home");
	const isSearchActive = pathname.startsWith("/mobile/search");

	const tabs = [
		{
			id: "my",
			icon: (
				<Star
					width="28"
					height="28"
					fill={isMyActive ? "black" : "#BBBBBF"}
				/>
			),
			label: "MY",
			path: "/mobile/my",
		},
		{
			id: "home",
			icon: (
				<Home
					width="24"
					height="24"
					fill={isHomeActive ? "black" : "#BBBBBF"}
				/>
			),
			label: "HOME",
			path: "/mobile/home",
		},
		{
			id: "search",
			icon: (
				<Search
					width="24"
					height="24"
					fill={isSearchActive ? "black" : "#BBBBBF"}
				/>
			),
			label: "SEARCH",
			path: "/mobile/search",
		},
	];

	const handleTabClick = (path: string) => {
		router.push(path);
	};

	return (
		<nav className="bg-white flex items-center gap-4 h-72px px-6 border-t-4px">
			{tabs.map((tab) => {
				const isActive =
					(tab.id === "my" && isMyActive) ||
					(tab.id === "home" && isHomeActive) ||
					(tab.id === "search" && isSearchActive);

				return (
					<button
						key={tab.id}
						className="flex-1 flex flex-col items-center gap-1"
						onClick={() => handleTabClick(tab.path)}
					>
						<div className="flex justify-center items-center w-8 h-8">{tab.icon}</div>
						<span className={cn("text-[10px] leading-12px", isActive ? "text-black" : "text-[#BBBBBF]")}>
							{tab.label}
						</span>
					</button>
				);
			})}
		</nav>
	);
};
