import { cn } from "@/common/utils";
import * as Tabs from "@radix-ui/react-tabs";
import { memo, ReactNode, useCallback, useState } from "react";
import { Tab } from "./types";
import { OpenInNew } from "@/assets/svgs";
import { LikeSection } from "./Like";
import { FollowSection } from "./Follow";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";

interface TabTriggerProps {
	onClick?: () => void;
	onClickIcon?: () => void;
	value: Tab;
	children: ReactNode;
}

const TabTrigger = memo(({ onClick, onClickIcon, value, children }: TabTriggerProps) => {
	const handleOnClick = useCallback(() => {
		onClick?.();
	}, [onClick, onClickIcon]);

	const handleOnClickIcon = useCallback(() => {
		onClickIcon?.();
	}, [onClickIcon]);

	return (
		<Tabs.Trigger
			asChild
			onClick={handleOnClick}
			value={value}
		>
			<div
				role="button"
				className={cn(
					"flex items-center justify-center @200px/sidebar:justify-between cursor-pointer @200px/sidebar:pl-3px",
					"font-suisse text-16px leading-20px tracking-016px font-bold",
					"data-[state=active]:text-hbc-black data-[state=inactive]:text-hbc-gray",
					"[&>button]:hidden data-[state=inactive]:[&>button]:hidden @200px/sidebar:data-[state=active]:[&>button]:block",
				)}
			>
				<span>{children}</span>
				<button
					className="cursor-pointer"
					onClick={handleOnClickIcon}
				>
					<OpenInNew />
				</button>
			</div>
		</Tabs.Trigger>
	);
});

TabTrigger.displayName = "TabTrigger";

interface TabContentProps {
	value: Tab;
	children: ReactNode;
}

const TabContent = memo(({ value, children }: TabContentProps) => (
	<Tabs.Content
		asChild
		className="flex flex-col flex-1 h-full overflow-y-hidden"
		value={value}
	>
		{children}
	</Tabs.Content>
));

TabContent.displayName = "TabContent";

export const SidebarTabs = memo(() => {
	const router = useRouter();
	const [currentTab, setCurrentTab] = useState<Tab>("like");

	const { data: userMe } = useQuery(getUserMeQueryOption());

	return (
		<Tabs.Root
			className="flex flex-col flex-1 h-full overflow-y-hidden"
			value={currentTab}
			onValueChange={(value) => setCurrentTab(value as Tab)}
		>
			<Tabs.List asChild>
				<div className="flex flex-col px-2">
					<div className="grid grid-cols-2">
						<TabTrigger
							value="like"
							onClickIcon={() => {
								if (currentTab === "like") {
									if (!userMe) {
										router.push("/auth/login");
										return;
									}
									router.push("/likes");
								}
							}}
						>
							Like
						</TabTrigger>
						<TabTrigger
							value="follow"
							onClickIcon={() => {
								if (currentTab === "follow") {
									if (!userMe) {
										router.push("/auth/login");
										return;
									}
									router.push("/follow-artists");
								}
							}}
						>
							Follow
						</TabTrigger>
					</div>
					<div className="relative w-full h-6px">
						<div className="absolute inset-x-0 w-full h-2px transition-all duration-300 @200px/sidebar:top-1/2 @200px/sidebar:-translate-y-1/2 bottom-0 bg-hbc-black" />
						<div
							className={cn(
								"absolute w-1/2 h-full bg-hbc-black",
								"transform transition-transform duration-300 ease-in-out",
								currentTab === "like" ? "translate-x-0" : "translate-x-full",
							)}
						/>
					</div>
				</div>
			</Tabs.List>

			<TabContent value="like">
				<LikeSection />
			</TabContent>
			<TabContent value="follow">
				<FollowSection />
			</TabContent>
		</Tabs.Root>
	);
});

SidebarTabs.displayName = "SidebarTabs";

export default SidebarTabs;
