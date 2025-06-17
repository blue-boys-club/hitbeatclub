"use client";

import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { FooterNav } from "@/components/layout/Footer/FooterNav";
import Header from "@/components/layout/Header/Header";
import { Toaster } from "@/components/ui/Toast/toaster";
import { MobileFooterPlayBar, MobileFullScreenPlayer } from "@/features/mobile/components";
import { useAuthStore } from "@/stores/auth";
import { useQuery } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

export default function MobileMainLayout({ children }: { children: React.ReactNode }) {
	const [isFullScreenPlayerOpen, setIsFullScreenPlayerOpen] = useState(false);

	const router = useRouter();
	const pathname = usePathname();

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

	return (
		<>
			<div className="w-full min-h-screen overflow-y-scroll flex flex-col">
				{!isSearchPage && (
					<div className="z-50 fixed top-0 left-0 right-0">
						<Header />
					</div>
				)}
				<div className={`flex-1 ${isSearchPage ? "pt-0" : "pt-[62px]"} pb-[142px]`}>
					<div className={`${isSearchPage ? "h-[calc(100vh-142px)]" : "h-[calc(100vh-204px)]"} overflow-y-auto`}>
						{children}
					</div>
				</div>
				<div className="z-50 fixed bottom-0 left-0 right-0">
					{/* TODO: 임시코드임. 풀스크린 플레이어 표시 조건 확정하여 반영 */}
					<div onClick={() => setIsFullScreenPlayerOpen(true)}>
						<MobileFooterPlayBar />
					</div>
					<FooterNav />
				</div>
			</div>
			{isFullScreenPlayerOpen && <MobileFullScreenPlayer onHide={() => setIsFullScreenPlayerOpen(false)} />}
			<Toaster viewportClassName="bottom-72px" />
		</>
	);
}
