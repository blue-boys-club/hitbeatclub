"use client";

import { NotificationOff } from "@/assets/svgs/NotificationOff";
import { NotificationOn } from "@/assets/svgs/NotificationOn";
import { UserProfile } from "@/assets/svgs/UserProfile";
import { cn } from "@/common/utils";
import { LoginButton, SubscribeButton, TagDropdown, UserAvatar } from "@/components/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { memo, useCallback, useState } from "react";

interface NotificationOption {
	label: string;
	value: string;
}

interface HeaderNavOption {
	label: string;
	value: string;
	className?: string;
}

const headerNavOptions: HeaderNavOption[] = [
	{
		label: "주문 목록",
		value: "orders",
	},
	{
		label: "아티스트 스튜디오",
		value: "studio",
	},
	{
		label: "로그아웃",
		value: "logout",
	},
];

export const HeaderNav = memo(() => {
	const navigate = useRouter();
	const [isLogined, setIsLogined] = useState(true);
	const [isSubscribed, setIsSubscribed] = useState(true);
	const [userProfileImage, setUserProfileImage] = useState(false);
	const [notificationOptions, setNotificationOptions] = useState<NotificationOption[]>([]);

	const signOut = useCallback(() => {
		console.log("로그아웃");
		// TODO: 실제 로그아웃 로직 구현
	}, []);

	const handelDropdownOptionSelect = useCallback(
		(value: string) => {
			switch (value) {
				case "orders":
					navigate.push("/orders");
					break;
				case "studio":
					navigate.push("/studio");
					break;
				case "logout":
					signOut();
					break;
			}
		},
		[navigate, signOut],
	);
	return (
		<nav
			className={cn("flex items-center gap-5")}
			role="navigation"
		>
			{isLogined ? (
				<>
					<SubscribeButton isSubscribed={isSubscribed} />

					<div className={cn("size-10 flex items-center justify-center cursor-pointer relative")}>
						<div className="absolute inset-0 flex items-center justify-center">
							{notificationOptions.length > 0 ? (
								<TagDropdown
									wrapperClassName="flex"
									optionsClassName={"top-[60px]"}
									optionsPosition="right-0"
									showChevron={false}
									options={notificationOptions.map((option) => ({
										...option,
										className: "rounded-[5px] text-base font-bold leading-4",
									}))}
								>
									<NotificationOn
										aria-label="알림 있음"
										className="w-10 h-10"
									/>
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
						{userProfileImage ? (
							<UserAvatar
								src={""}
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
					href={"/login"}
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
