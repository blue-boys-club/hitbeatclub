"use client";

import React, { memo, useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";

import { NotificationOff } from "@/assets/svgs/NotificationOff";
import { UserProfile } from "@/assets/svgs/UserProfile";
import { cn } from "@/common/utils";
import { LoginButton, SubscribeButton, TagDropdown, UserAvatar } from "@/components/ui";
import { useLayoutStore } from "@/stores/layout";
import { useAuthStore } from "@/stores/auth";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface NotificationOption {
	label: string;
	value: string;
}

interface HeaderNavOption {
	label: string;
	value: string;
	href?: string;
	className?: string;
}

const headerNavOptions: HeaderNavOption[] = [
	{
		label: "주문 목록",
		value: "orders",
	},
	{
		label: "아티스트 스튜디오",
		value: "artist-studio",
	},
	{
		label: "로그아웃",
		value: "logout",
	},
];

export const HeaderNav = memo(() => {
	const router = useRouter();
	const { toast } = useToast();
	const { isLoggedIn, logout } = useAuthStore(
		useShallow((state) => ({
			isLoggedIn: !!state.user?.userId,
			logout: state.makeLogout,
		})),
	);
	const { data: user } = useQuery(getUserMeQueryOption());

	const [notificationOptions, setNotificationOptions] = useState<NotificationOption[]>([]);

	const signOut = useCallback(() => {
		logout();
		toast({
			description: "로그아웃 되었습니다.",
		});
	}, [logout, toast]);

	const handelDropdownOptionSelect = useCallback(
		(value: string) => {
			switch (value) {
				case "orders":
					router.push("/orders");
					break;
				case "artist-studio":
					router.push("/artist-studio/123");
					break;
				case "logout":
					signOut();
					break;
			}
		},
		[router, signOut],
	);
	return (
		<nav
			className={cn("flex items-center gap-5")}
			role="navigation"
		>
			{isLoggedIn ? (
				<>
					<SubscribeButton
						component="Link"
						href={user?.subscribedAt ? "/artist-studio" : "/subscribe"}
						isSubscribed={!!user?.subscribedAt}
					/>

					<div className={cn("size-10 flex items-center justify-center cursor-pointer relative")}>
						<div className="absolute inset-0 flex items-center justify-center">
							{notificationOptions.length > 0 ? (
								<TagDropdown
									wrapperClassName="flex"
									optionsClassName={"top-[60px] max-h-[400px] overflow-y-auto justify-start"}
									optionsPosition="right-0"
									showChevron={false}
									options={notificationOptions.map((option) => ({
										...option,
										className: "rounded-[5px] text-base font-bold leading-4",
									}))}
								>
									<div>
										<div className="flex size-[18px] items-center justify-center absolute right-0 top-0 rounded-full font-bold text-[11px] bg-red-500 text-white">
											{notificationOptions.length > 9 ? "9+" : notificationOptions.length}
										</div>
										<NotificationOff
											aria-label="알림 있음"
											className="w-10 h-10"
										/>
									</div>
								</TagDropdown>
							) : (
								<NotificationOff
									aria-label="알림 없음"
									className="w-10 h-10"
								/>
							)}
						</div>
					</div>

					<TagDropdown
						wrapperClassName="flex"
						optionsClassName={"absolute top-[55px]"}
						optionsPosition={"right-0"}
						showChevron={false}
						options={headerNavOptions.map((option) => ({
							...option,
							className: "rounded-[5px] text-base font-bold leading-4",
						}))}
						onSelect={handelDropdownOptionSelect}
					>
						{user?.profileUrl ? (
							<UserAvatar
								src={user.profileUrl}
								alt="사용자 프로필 이미지"
								className="w-10 h-10"
							/>
						) : (
							<UserProfile
								aria-label="프로필"
								className="w-10 h-10"
							/>
						)}
					</TagDropdown>
				</>
			) : (
				<Link
					href={"/auth/login"}
					className={cn("h-10 flex items-center justify-center")}
					aria-label="로그인"
				>
					<LoginButton />
				</Link>
			)}
		</nav>
	);
});

HeaderNav.displayName = "HeaderNav";
