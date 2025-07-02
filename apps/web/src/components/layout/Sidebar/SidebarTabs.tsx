import { cn } from "@/common/utils";
import * as Tabs from "@radix-ui/react-tabs";
import { memo, ReactNode, useState } from "react";
import { Tab } from "./types";
import { OpenInNew } from "@/assets/svgs";
import { LikeSection } from "./Like";
import { FollowSection } from "./Follow";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";

interface TabTriggerProps {
	onClick: () => void;
	value: Tab;
	children: ReactNode;
	showOpenInNew: boolean;
}

const TabTrigger = memo(({ onClick, value, children, showOpenInNew }: TabTriggerProps) => {
	return (
		<div className="flex items-center justify-between">
			<Tabs.Trigger
				className={cn(
					"flex items-center cursor-pointer pl-3px flex-1",
					"font-suisse text-16px leading-20px tracking-016px font-bold",
					"data-[state=active]:text-hbc-black data-[state=inactive]:text-hbc-gray",
				)}
				value={value}
			>
				<span>{children}</span>
			</Tabs.Trigger>

			{showOpenInNew && (
				<button
					onClick={onClick}
					className={cn(
						"hidden @200px/sidebar:block",
						"data-[state=active]:block data-[state=inactive]:hidden",
						"cursor-pointer",
					)}
				>
					<OpenInNew />
				</button>
			)}
		</div>
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
							onClick={() => {
								if (!userMe) {
									router.push("/auth/login");
									return;
								}
								router.push("/likes");
							}}
							showOpenInNew={currentTab === "like"}
						>
							Like
						</TabTrigger>
						<TabTrigger
							value="follow"
							onClick={() => {
								if (!userMe) {
									router.push("/auth/login");
									return;
								}
								router.push("/follow-artists");
							}}
							showOpenInNew={currentTab === "follow"}
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
