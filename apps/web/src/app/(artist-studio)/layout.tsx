"use client";

import { cn } from "@/common/utils";
import { ArtistSidebar } from "@/components/layout/ArtistSidebar";
import Header from "@/components/layout/Header/Header";
import { Toaster } from "@/components/ui/Toast/toaster";

export default function MainLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="h-screen overflow-hidden">
			{/* Fixed Sidebar - 100vh - footer size */}
			<div className={cn("fixed left-0 top-0 h-[calc(100vh)]")}>
				<ArtistSidebar />
			</div>

			{/* Fixed Header */}
			<Header />

			{/* Main Content */}
			<main
				className={cn(
					"absolute top-[72px] right-0 pt-15px overflow-auto",
					"transition-all duration-300",
					"h-[calc(100vh-72px)]", // 100vh - header size - footer
					"left-308px",
				)}
			>
				{children}
			</main>
			<Toaster viewportClassName="bottom-0px" />
		</div>
	);
}
