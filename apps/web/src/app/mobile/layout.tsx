"use client";

import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { FooterNav } from "@/components/layout/Footer/FooterNav";
import Header from "@/components/layout/Header/Header";
import { Toaster } from "@/components/ui/Toast/toaster";
import { AudioProvider } from "@/contexts/AudioContext";
import { MobilePlayer } from "@/features/mobile/components/MobilePlayer";
import { useAuthStore } from "@/stores/auth";
import { useQuery } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useMobilePlayerVisibility } from "@/hooks/use-mobile-player-visibility";
import { useResponsiveRouting } from "@/hooks/use-responsive-routing";

export default function MobileMainLayout({ children }: { children: React.ReactNode }) {
	// PC 환경에서 접근 시 PC 레이아웃으로 자동 리다이렉트
	useResponsiveRouting("mobile");
	const router = useRouter();
	const pathname = usePathname();
	const { isMobilePlayerVisible } = useMobilePlayerVisibility();

	const { data: userMe, isSuccess } = useQuery({ ...getUserMeQueryOption(), retry: false });

	const { setPhoneNumber, userPhoneNumber } = useAuthStore(
		useShallow((state) => ({ setPhoneNumber: state.setPhoneNumber, userPhoneNumber: state.user?.phoneNumber })),
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

	const isSearchPage = pathname === "/mobile/search";

	const getContentHeight = () => {
		if (isSearchPage) {
			return "h-[calc(100vh-142px)]";
		}
		return isMobilePlayerVisible ? "h-[calc(100vh-204px)]" : "h-[calc(100vh-132px)]";
	};

	return (
		<AudioProvider>
			<div className="w-full min-h-screen overflow-y-scroll flex flex-col">
				{!isSearchPage && (
					<div className="z-50 fixed top-0 left-0 right-0">
						<Header mobile />
					</div>
				)}
				<div className={`flex-1 ${isSearchPage ? "pt-0" : "pt-[62px]"} pb-[70px]`}>
					<div className={`${getContentHeight()} overflow-y-auto`}>{children}</div>
				</div>
				<div className="z-50 fixed bottom-0 left-0 right-0">
					<FooterNav />
				</div>
			</div>
			<MobilePlayer />
			<Toaster viewportClassName="bottom-144px z-[500]" />
		</AudioProvider>
	);
}
