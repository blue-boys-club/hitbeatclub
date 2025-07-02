"use client";

import React, { memo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/common/utils";
import { Home } from "@/assets/svgs/Home";
import { SearchBar } from "./SearchBar";
import { HeaderNav } from "./HeaderNav";
import { UserProfile } from "@/assets/svgs";
import { ArrowLeftShort } from "@/assets/svgs/ArrowLeftShort";
import { TagDropdown, UserAvatar } from "@/components/ui";
import { useAuthStore } from "@/stores/auth";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { useToast } from "@/hooks/use-toast";
import { QUERY_KEYS } from "@/apis/query-keys";

interface MobileHeaderNavOption {
	label: string;
	value: string;
}

const mobileHeaderNavOptions: MobileHeaderNavOption[] = [
	{
		label: "내 계정",
		value: "profile",
	},
	// {
	// 	label: "주문목록",
	// 	value: "order",
	// },
	{
		label: "장바구니",
		value: "cart",
	},
	{
		label: "멤버십관리",
		value: "subscribe",
	},
	{
		label: "공지사항",
		value: "notice",
	},
	// {
	// 	label: "고객센터",
	// 	value: "customer-center",
	// },
	{
		label: "로그아웃",
		value: "logout",
	},
	// {
	// 	label: "아티스트스튜디오",
	// 	value: "artist-studio",
	// },
];

const Header = memo(({ mobile }: { mobile?: boolean }) => {
	return mobile ? <MobileHeader /> : <PCHeader />;
});

Header.displayName = "Header";

export default Header;

const PCHeader = () => {
	return (
		<header
			className={cn(
				"w-[calc(100vw-237px)] bg-white z-5",
				"fixed top-0 right-0 z-10 border-0 border-b-[8px] px-5 py-3 mb-0",
				"flex items-center gap-7 justify-between shrink-0",
				"transition-all duration-300",
			)}
		>
			<div className="flex items-center gap-7 flex-1">
				<Link href="/">
					<Home />
				</Link>
				<SearchBar />
			</div>
			<HeaderNav />
		</header>
	);
};

const MobileHeader = () => {
	const router = useRouter();
	const { toast } = useToast();
	const { isLoggedIn, logout } = useAuthStore(
		useShallow((state) => ({
			isLoggedIn: !!state.user?.userId,
			logout: state.makeLogout,
		})),
	);
	const { data: user } = useQuery(getUserMeQueryOption());
	const queryClient = useQueryClient();

	const signOut = useCallback(() => {
		logout();
		queryClient.removeQueries({ queryKey: QUERY_KEYS.user._key });
		toast({
			description: "로그아웃 되었습니다.",
		});
	}, [logout, toast, queryClient]);

	const handleDropdownOptionSelect = useCallback(
		(value: string) => {
			switch (value) {
				case "profile":
					void router.push("/mobile/settings");
					break;
				// case "order":
				// 	break;
				case "cart":
					void router.push("/mobile/my/cart");
					break;
				case "subscribe":
					void router.push("/mobile/subscribe");
					break;
				case "notice":
					void router.push("/mobile/notice");
					break;
				// case "customer-center":
				// 	break;
				case "logout":
					signOut();
					void router.push("/mobile/login");
					break;
				// case "artist-studio":
				// 	break;
			}
		},
		[router, signOut],
	);

	const handleUserProfileClick = useCallback(() => {
		if (!isLoggedIn) {
			void router.push("/mobile/login");
		}
	}, [isLoggedIn, router]);

	return (
		<header className={cn("bg-white px-4 w-full h-62px flex justify-between items-center")}>
			<div className="relative border-3px border-hbc-red rounded-40px pl-10px pr-30px py-6px">
				<span className="block text-hbc-red font-bold leading-14px">ARTIST STUDIO</span>
				<button
					className="absolute top-1/2 right-2px w-6 h-6 flex justify-center items-center"
					style={{ transform: "translateY(-50%)" }}
				>
					<ArrowLeftShort fill="red" />
				</button>
			</div>
			<div className="flex gap-4 items-center">
				{isLoggedIn ? (
					<TagDropdown
						wrapperClassName="flex"
						optionsClassName="absolute top-[40px]"
						optionsPosition="right-0"
						showChevron={false}
						options={mobileHeaderNavOptions.map((option) => ({
							...option,
							className: "rounded-[5px] text-base font-bold leading-4",
						}))}
						onSelect={handleDropdownOptionSelect}
					>
						{user?.profileUrl ? (
							<UserAvatar
								src={user.profileUrl}
								alt="사용자 프로필 이미지"
								className="w-30px h-30px"
							/>
						) : (
							<UserProfile
								aria-label="프로필"
								className="w-30px h-30px"
							/>
						)}
					</TagDropdown>
				) : (
					<button
						className="flex justify-center items-center w-30px h-30px"
						onClick={handleUserProfileClick}
					>
						<UserProfile />
					</button>
				)}
			</div>
		</header>
	);
};
