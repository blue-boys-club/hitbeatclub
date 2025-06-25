"use client";

import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { cn } from "@/common/utils";
import { MusicRightSidebar } from "@/components/layout";
import { FooterPlayer } from "@/components/layout/Footer/Player/FooterPlayer";
import Header from "@/components/layout/Header/Header";
import PlaylistRightSidebar from "@/components/layout/PlaylistRightSidebar/PlaylistRightSidebar";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { Toaster } from "@/components/ui/Toast/toaster";
import { AudioProvider } from "@/contexts/AudioContext";
import { DndContext } from "@/features/dnd/components/DndContext";
import { useAuthStore } from "@/stores/auth";
import { SidebarType, useLayoutStore } from "@/stores/layout";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export default function MainLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();

	const { data: userMe, isSuccess } = useQuery({ ...getUserMeQueryOption(), retry: false });

	const { setPhoneNumber, userPhoneNumber } = useAuthStore(
		useShallow((state) => ({ setPhoneNumber: state.setPhoneNumber, userPhoneNumber: state.user?.phoneNumber })),
	);
	const { isLeftSidebarOpen, isRightSidebarOpen, rightSidebarType } = useLayoutStore(
		useShallow((state) => ({
			isLeftSidebarOpen: state.leftSidebar.isOpen,
			isRightSidebarOpen: state.rightSidebar.isOpen,
			rightSidebarType: state.rightSidebar.currentType,
		})),
	);

	useEffect(() => {
		if (isSuccess) {
			const phoneNumber = userMe.phoneNumber;
			setPhoneNumber(phoneNumber);

			if (!userPhoneNumber) {
				router.push("/auth/signup");
			}
		}
	}, [isSuccess, setPhoneNumber, userMe, router, userPhoneNumber]);

	return (
		<AudioProvider>
			<DndContext>
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
						{rightSidebarType === SidebarType.TRACK && <MusicRightSidebar />}
						{rightSidebarType === SidebarType.PLAYLIST && <PlaylistRightSidebar />}
					</div>

					{/* Fixed Footer */}

					<div className="fixed left-0 right-0 bottom-12px">
						<FooterPlayer />
					</div>

					<Toaster viewportClassName="bottom-92px" />
				</div>
			</DndContext>
		</AudioProvider>
	);
}
