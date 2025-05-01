"use client";

import { cn } from "@/common/utils";
import { MusicRightSidebar } from "@/components/layout";
import { FooterPlayer } from "@/components/layout/Footer/Player/FooterPlayer";
import Header from "@/components/layout/Header/Header";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { Toaster } from "@/components/ui/Toast/toaster";
import { useLayoutStore } from "@/stores/layout";
import { useShallow } from "zustand/react/shallow";

export default function MainLayout({ children }: { children: React.ReactNode }) {
	// const [isCollapsed, setIsCollapsed] = useState(false);
	// const [isMusicSidebarOpen, setIsMusicSidebarOpen] = useState(false);
	const { isLeftSidebarOpen, isRightSidebarOpen } = useLayoutStore(
		useShallow((state) => ({
			isLeftSidebarOpen: state.leftSidebar.isOpen,
			isRightSidebarOpen: state.rightSidebar.isOpen,
		})),
	);

	return (
		<div className="h-screen overflow-hidden">
			{/* Fixed Sidebar - 100vh - footer size */}
			<div className={cn("fixed left-0 top-0 h-[calc(100vh-92px)]", isLeftSidebarOpen ? "w-305px" : "w-150px")}>
				<Sidebar />
			</div>

			{/* Fixed Header */}
			<Header />

			{/* Main Content */}
			<main
				className={cn(
					"absolute top-[72px] right-0 pt-15px overflow-auto",
					"transition-all duration-500",
					"h-[calc(100vh-72px-92px)]", // 100vh - header size - footer
					isLeftSidebarOpen ? "left-[305px] pl-11px" : "left-[150px] pl-83px",
					isRightSidebarOpen ? "pr-[329px]" : "pr-[40px]",
				)}
			>
				{children}
			</main>

			<div className="fixed right-0">
				<MusicRightSidebar />
			</div>

			{/* Fixed Footer */}
			<div className="fixed left-0 right-0 z-[10] bottom-12px">
				<FooterPlayer />
			</div>

			<Toaster viewportClassName="bottom-92px" />
		</div>
	);
}
