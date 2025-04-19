"use client";

import { memo, useCallback, useState } from "react";
import { cn } from "@/common/utils";
import { HBCTopLogo, SidebarArrow } from "@/assets/svgs";
import { CartSection } from "./Cart";
import SidebarTabs from "./SidebarTabs";

interface SidebarProps {
	isCollapsed: boolean;
	onToggleCollapse: (isCollapsed: boolean) => void;
}

export const Sidebar = memo(({ isCollapsed, onToggleCollapse }: SidebarProps) => {
	const handleCollapseToggle = useCallback(() => {
		onToggleCollapse(!isCollapsed);
	}, [isCollapsed, onToggleCollapse]);

	return (
		<div
			className={cn(
				"flex flex-col flex-1 h-full gap-5px transition-all duration-300 ",
				isCollapsed ? "w-150px" : "w-305px",
			)}
		>
			<div className="flex-none px-13px pt-19px">
				<HBCTopLogo />
			</div>
			<aside
				className={cn(
					"flex flex-col",
					"bg-hbc-white border-r-2 border-hbc-black",
					"overflow-hidden",
					"@container/sidebar",
				)}
			>
				<div className="relative">
					<button
						type="button"
						onClick={handleCollapseToggle}
						aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
						className="absolute top-0 cursor-pointer -right-2px"
					>
						<SidebarArrow className={"transition-all duration-300 -scale-x-100 @200px/sidebar:scale-x-100"} />
					</button>
				</div>

				<div className="flex flex-col items-stretch text-base font-bold text-black -full pl-8px font-suisse">
					<CartSection />
				</div>

				<div className="flex flex-col flex-1 w-full h-full overflow-y-hidden">
					<SidebarTabs />
				</div>
			</aside>
		</div>
	);
});

Sidebar.displayName = "Sidebar";
