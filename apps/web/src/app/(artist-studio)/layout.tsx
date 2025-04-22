"use client";

import { cn } from "@/common/utils";
import { ArtistSidebar } from "@/components/layout/ArtistSidebar";
import { Footer } from "@/components/layout/Footer";
import Header from "@/components/layout/Header/Header";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { Toaster } from "@/components/ui/Toast/toaster";
import { useState } from "react";
export default function MainLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="h-screen overflow-hidden">
			{/* Fixed Sidebar - 100vh - footer size */}
			<div className={cn("fixed left-0 top-0 h-[calc(100vh-92px)]")}>
				<ArtistSidebar />
			</div>

			{/* Fixed Header */}
			<Header />

			{/* Main Content */}
			<main
				className={cn(
					"absolute top-[72px] right-0 pt-15px overflow-auto",
					"transition-all duration-300",
					"h-[calc(100vh-72px-92px)]", // 100vh - header size - footer
					"left-308px",
				)}
			>
				{children}
			</main>

			{/* Fixed Footer */}
			{/* <div className="fixed left-0 right-0 z-10 bottom-12px">
				<Footer />
			</div> */}

			<Toaster viewportClassName="bottom-0px" />
		</div>
	);
}
