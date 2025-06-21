import { cn } from "@/common/utils";
import * as Tabs from "@radix-ui/react-tabs";
import { memo, ReactNode, useState } from "react";
import { Tab } from "./types";
import { OpenInNew } from "@/assets/svgs";
import { LikeSection } from "./Like";
import { FollowSection } from "./Follow";
import { useRouter } from "next/navigation";
import { DropContentWrapper } from "@/features/dnd/componenets/DropContentWrapper";

interface TabTriggerProps {
	onClick: () => void;
	value: Tab;
	children: ReactNode;
}

const TabTrigger = memo(({ onClick, value, children }: TabTriggerProps) => {
	return (
		<Tabs.Trigger
			className={cn(
				"flex items-center justify-center @200px/sidebar:justify-between cursor-pointer @200px/sidebar:pl-3px",
				"font-suisse text-16px leading-20px tracking-016px font-bold",
				"data-[state=active]:text-hbc-black data-[state=inactive]:text-hbc-gray",
				"[&>svg]:hidden data-[state=inactive]:[&>svg]:hidden @200px/sidebar:data-[state=active]:[&>svg]:block",
			)}
			onClick={onClick}
			value={value}
		>
			<span>{children}</span>
			<OpenInNew />
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
								if (currentTab === "like") {
									/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
									/* @ts-ignore TODO: Implement navigation to /like */
									router.push("/likes");
								}
							}}
						>
							Like
						</TabTrigger>
						<TabTrigger
							value="follow"
							onClick={() => {
								if (currentTab === "follow") {
									/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
									/* @ts-ignore TODO: Implement navigation to /follow */
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
