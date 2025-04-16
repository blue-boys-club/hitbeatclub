import Image from "next/image";
import Upload from "@/assets/svgs/Upload";
import { ArtistAvatar } from "@/components/ui";
import NavLink from "./components/NavLink";
import ArtistStatRow from "./components/ArtistStatRow";
import { Dollars } from "@/assets/svgs/Dollars";
import { ArtistInfo } from "@/assets/svgs/ArtistInfo";
import { UserProfile } from "@/assets/svgs/UserProfile";

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

const ArtistSidebar = () => {
	return (
		<div className="pt-4 pl-3 w-fit">
			<Image
				src="/assets/logo.png"
				alt="로고"
				width={120}
				height={67}
			/>
			<div className="pt-4 pb-4 pr-2 w-fit border-r-2 border-[#FF1900]">
				<div className="pt-[6px] pb-[14px] pr-[137px] mb-[10px] border-b-6 border-[#FF1900]">
					<h1 className="text-[#FF1900] text-xl font-extrabold text-center tracking-[0.2px]">ARTIST STUDIO</h1>
				</div>

				<div className="flex flex-col gap-5 items-center justify-center">
					<ArtistAvatar
						src=""
						alt="아티스트 프로필 이미지"
						className="bg-black"
						size="large"
					/>
					<div className="text-black text-center font-suisse text-[38px] font-bold leading-[40px] tracking-[0.38px]">
						홍길동
					</div>

					<ArtistStatRow artistStats={artistStats} />

					<label className="flex flex-col gap-5 items-center justify-center px-22 py-10 border-dotted border-[#FF1900] border cursor-pointer">
						<Upload className="hover:opacity-80 transition-opacity" />
						<span className="text-[#FF1900] text-center font-suit text-[13px] font-extrabold leading-[20px] tracking-[0.13px]">
							Drop Your Fire🔥
						</span>
						<button
							className="hidden"
							onClick={() => {}}
						/>
					</label>

					<div className="flex flex-col gap-[10px] py-3 border-y-[6px] border-[#FF1900]">
						{navItems.map(({ href, label, icon }) => (
							<NavLink
								key={label}
								href={href}
								label={label}
								Icon={icon}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ArtistSidebar;
