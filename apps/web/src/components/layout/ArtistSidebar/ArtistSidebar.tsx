"use client";

import Image from "next/image";
import Upload from "@/assets/svgs/Upload";
import { ArtistAvatar } from "@/components/ui";
import NavLink from "./NavLink";
import ArtistStatRow from "./ArtistStatRow";
import { Dollars } from "@/assets/svgs/Dollars";
import { ArtistInfo } from "@/assets/svgs/ArtistInfo";
import { UserProfile } from "@/assets/svgs/UserProfile";
import { ArtistStudioTitle } from "./ArtistStudioTitle";

const artistStats = [
	{ label: "Follower", value: "4,567" },
	{ label: "Tracks", value: "52" },
	{ label: "Visitors", value: "976" },
];

const navItems = [
	{ href: "/studio", label: "My Studio", icon: UserProfile },
	{ href: "/artist-info", label: "Artist Info", icon: ArtistInfo },
	{ href: "/payouts", label: "Payouts", icon: Dollars },
];

export const ArtistSidebar = () => {
	return (
		<div className="flex flex-col flex-1 h-full gap-8px">
			<div className="flex-none px-13px pt-19px">
				<Image
					src="/assets/logo.png"
					alt="로고"
					width={120}
					height={67}
				/>
			</div>

			<aside className="border-r-2 bg-hbc-white border-hbc-red pb-16px">
				<div className="flex items-center justify-start px-4px pr-5px pl-9px ">
					{/* 이거 왜 피그마에 SVG로 있나요... */}
					<ArtistStudioTitle />
				</div>

				<hr className="border-hbc-red border-3 my-10px mr-9px ml-4px" />

				<section className="flex flex-col items-center justify-center gap-20px">
					<ArtistAvatar
						src="/"
						alt="아티스트 프로필 이미지"
						className="bg-black my-8px"
						size="small"
					/>

					<h2 className="font-bold text-center text-black font-suisse text-38px leading-40px tracking-038px h-40px">
						홍길동
					</h2>

					<ArtistStatRow artistStats={artistStats} />
				</section>

				<section className="flex flex-col mt-48px pl-20px pr-11px gap-15px ">
					<div
						className="flex flex-col items-center justify-center gap-5 px-8px py-40px border border-dotted border-[#FF1900] cursor-pointer"
						role="button"
						tabIndex={0}
						onClick={() => {}}
					>
						<Upload className="transition-opacity hover:opacity-80" />
						<span className="text-[#FF1900] text-[13px] font-extrabold">Drop Your Fire🔥</span>
					</div>

					<nav className="flex flex-col w-full gap-10px pt-11px pb-6px border-y-6px border-hbc-red">
						{navItems.map(({ href, label, icon }) => (
							<NavLink
								key={label}
								href={href}
								label={label}
								Icon={icon}
							/>
						))}
					</nav>
				</section>
			</aside>
		</div>
	);
};
