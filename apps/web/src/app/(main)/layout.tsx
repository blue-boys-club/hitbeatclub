"use client";

import { cn } from "@/common/utils";
import { MusicRightSidebar } from "@/components/layout";
import { Footer } from "@/components/layout/Footer";
import Header from "@/components/layout/Header/Header";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { Toaster } from "@/components/ui/Toast/toaster";
import { useState } from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isMusicSidebarOpen, setIsMusicSidebarOpen] = useState(false);

	return (
		<div className="h-screen overflow-hidden">
			{/* Fixed Sidebar - 100vh - footer size */}
			<div className={cn("fixed left-0 top-0 h-[calc(100vh-92px)]", isCollapsed ? "w-150px" : "w-305px")}>
				<Sidebar
					isCollapsed={isCollapsed}
					onToggleCollapse={setIsCollapsed}
				/>
			</div>

			{/* Fixed Header */}
			<Header />

			{/* Main Content */}
			<main
				className={cn(
					"absolute top-[72px] right-0 pt-15px overflow-auto",
					"transition-all duration-300",
					"h-[calc(100vh-72px-92px)]", // 100vh - header size - footer
					isCollapsed ? "left-[150px] pl-83px" : "left-[305px] pl-11px",
					isMusicSidebarOpen ? "pr-[320px]" : "pr-[40px]",
				)}
			>
				{children}
			</main>

			<div className="fixed right-0 z-10">
				<MusicRightSidebar
					isOpen={isMusicSidebarOpen}
					onToggleOpen={setIsMusicSidebarOpen}
				/>
			</div>

			{/* Fixed Footer */}
			<div className="fixed left-0 right-0 z-10 bottom-12px">
				<Footer />
			</div>

			<Toaster viewportClassName="bottom-92px" />
		</div>
	);
}
