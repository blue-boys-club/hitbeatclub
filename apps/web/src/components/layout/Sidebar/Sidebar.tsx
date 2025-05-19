"use client";

import { memo, useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/common/utils";
import { HBCTopLogo, SidebarArrow } from "@/assets/svgs";
import { CartSection } from "./Cart";
import SidebarTabs from "./SidebarTabs";
import { useLayoutStore } from "@/stores/layout";
import Link from "next/link";

export const Sidebar = memo(() => {
	const { isOpen, setLeftSidebar } = useLayoutStore(
		useShallow((state) => ({
			isOpen: state.leftSidebar.isOpen,
			setLeftSidebar: state.setLeftSidebar,
		})),
	);

	const handleCollapseToggle = useCallback(() => {
		setLeftSidebar(!isOpen);
	}, [isOpen, setLeftSidebar]);

	return (
		<div
			className={cn("flex flex-col flex-1 h-full gap-5px transition-all duration-500 ", isOpen ? "w-305px" : "w-150px")}
		>
			<div className="flex-none px-13px pt-19px">
				<Link href="/">
					<HBCTopLogo />
				</Link>
			</div>
			<aside
				className={cn(
					"flex flex-col",
					"bg-hbc-white border-r-2 border-hbc-black",
					"overflow-hidden flex-1",
					"@container/sidebar",
				)}
			>
				<div className="relative">
					<button
						type="button"
						onClick={handleCollapseToggle}
						aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
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
