"use client";

import { cn } from "@/common/utils";
import { useRouter, usePathname } from "next/navigation";
import { useMemo } from "react";

export const MobileMyNav = () => {
	const router = useRouter();
	const pathname = usePathname();

	const tabs = [
		{
			label: "Cart",
			value: "cart",
			path: "/mobile/my/cart",
		},
		{
			label: "Like",
			value: "like",
			path: "/mobile/my/like",
		},
		{
			label: "Follow",
			value: "follow",
			path: "/mobile/my/follow",
		},
	];

	// 현재 경로에 따라 선택된 탭 결정
	const selectedTab = useMemo(() => {
		const currentTab = tabs.find((tab) => pathname === tab.path);
		return currentTab?.value || "cart";
	}, [pathname]);

	const handleTabClick = (path: string) => {
		router.push(path);
	};

	return (
		<div className="border-t-4px border-black px-4 flex gap-1 items-center h-60px">
			{tabs.map((tab) => (
				<button
					key={tab.value}
					className={cn(
						"flex-1 border-b-[6px] border-hbc-gray text-start transition-colors",
						selectedTab === tab.value && "border-black",
					)}
					onClick={() => handleTabClick(tab.path)}
				>
					<span className="text-16px leading-20px font-bold mb-1">{tab.label}</span>
				</button>
			))}
		</div>
	);
};
