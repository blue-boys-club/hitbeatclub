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
import { useLayoutStore } from "@/stores/layout";
import { useAudioStore } from "@/stores/audio";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { usePlaylist } from "@/hooks/use-playlist";

export default function MainLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();

	const { data: userMe, isSuccess } = useQuery({ ...getUserMeQueryOption(), retry: false });

	const { setPhoneNumber, userPhoneNumber } = useAuthStore(
		useShallow((state) => ({ setPhoneNumber: state.setPhoneNumber, userPhoneNumber: state.user?.phoneNumber })),
	);
	const { isLeftSidebarOpen, isRightSidebarOpen } = useLayoutStore(
		useShallow((state) => ({
			isLeftSidebarOpen: state.leftSidebar.isOpen,
			isRightSidebarOpen: state.rightSidebar.isOpen,
		})),
	);

	// 플레이어 노출 여부: 플레이리스트에 트랙이 있고, 현재 재생 중인 트랙 ID가 존재할 때
	const { trackIds } = usePlaylist();
	const { productId } = useAudioStore(useShallow((state) => ({ productId: state.productId })));
	const isPlayerVisible = useMemo(() => trackIds.length > 0 && productId !== null, [trackIds.length, productId]);

	// 사이드바 표시 여부(실제 너비 반영)는 열려 있고, 플레이리스트가 있으며, 트랙이 선택된 경우만 true
	const isRightSidebarVisible = useMemo(
		() => isRightSidebarOpen && trackIds.length > 0 && productId !== null,
		[isRightSidebarOpen, trackIds.length, productId],
	);

	// 레이아웃 관련 동적 클래스 계산
	const sidebarHeightClass = useMemo(() => (isPlayerVisible ? "h-[calc(100vh-92px)]" : "h-screen"), [isPlayerVisible]);
	const mainHeightClass = useMemo(
		() => (isPlayerVisible ? "h-[calc(100vh-72px-92px)]" : "h-[calc(100vh-72px)]"),
		[isPlayerVisible],
	);
	const toasterBottomClass = useMemo(() => (isPlayerVisible ? "bottom-92px" : "bottom-0"), [isPlayerVisible]);

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
					<div className={cn("fixed left-0 top-0", sidebarHeightClass, isLeftSidebarOpen ? "w-305px" : "w-150px")}>
						<Sidebar />
					</div>

					{/* Fixed Header */}
					<Header />

					{/* Main Content */}
					<main
						className={cn(
							"absolute top-[72px] right-0 pt-15px overflow-auto",
							"transition-all duration-500",
							mainHeightClass,
							isLeftSidebarOpen ? "left-[305px] pl-11px" : "left-[150px] pl-83px",
							isRightSidebarVisible ? "pr-[329px]" : "pr-[40px]",
						)}
					>
						{children}
					</main>

					<div className="fixed right-0">
						<MusicRightSidebar />
						<PlaylistRightSidebar />
					</div>

					{/* Fixed Footer */}

					<div className="fixed left-0 right-0 bottom-12px">
						<FooterPlayer />
					</div>

					<Toaster viewportClassName={toasterBottomClass} />
				</div>
			</DndContext>
		</AudioProvider>
	);
}
