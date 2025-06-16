"use client";

import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { FooterNav } from "@/components/layout/Footer/FooterNav";
import Header from "@/components/layout/Header/Header";
import { Toaster } from "@/components/ui/Toast/toaster";
import { useAuthStore } from "@/stores/auth";
import { useQuery } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export default function MobileMainLayout({ children }: { children: React.ReactNode }) {
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
				<div className={`flex-1 ${isSearchPage ? "pt-0" : "pt-[62px]"} pb-[72px]`}>
					<div className={`${isSearchPage ? "h-[calc(100vh-72px)]" : "h-[calc(100vh-134px)]"} overflow-y-auto`}>
						{children}
					</div>
				</div>
				<div className="z-50 fixed bottom-0 left-0 right-0">
					<FooterNav />
				</div>
			</div>
			<Toaster viewportClassName="bottom-72px" />
		</>
	);
}
