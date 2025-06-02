"use client";

import Image from "next/image";
import { ArtistAvatar } from "@/components/ui";
import NavLink from "./NavLink";
import ArtistStatRow from "./ArtistStatRow";
import { Dollars } from "@/assets/svgs/Dollars";
import { ArtistInfo } from "@/assets/svgs/ArtistInfo";
import { UserProfile } from "@/assets/svgs/UserProfile";
import { ArtistStudioTitle } from "./ArtistStudioTitle";
import { Popup, PopupContent, PopupHeader, PopupTitle, PopupFooter, PopupDescription } from "@/components/ui/Popup";
import { Button } from "@/components/ui/Button";
import { useMemo, useState } from "react";
import { Upload } from "@/assets/svgs";
import { useRouter } from "next/navigation";
import { getArtistMeQueryOption } from "@/apis/artist/query/artist.query-options";
import { useQuery } from "@tanstack/react-query";

const artistStats = [
	{ label: "Follower", value: "4,567" },
	{ label: "Tracks", value: "52" },
	{ label: "Visitors", value: "976" },
];

export const ArtistSidebar = () => {
	const [isProfileWarningOpen, setIsProfileWarningOpen] = useState(false);
	const [isLockedNavWarningOpen, setIsLockedNavWarningOpen] = useState(false);
	const [profileData, setProfileData] = useState(null); // TODO: 실제 프로필 데이터 연동 필요

	const { data: artistMe, isSuccess: isArtistMeSuccess } = useQuery(getArtistMeQueryOption());
	const navItems = useMemo(() => {
		if (!isArtistMeSuccess) return [];

		const isStudioLocked = [artistMe.stageName, artistMe.slug, artistMe.description].some((value) => value === null);

		return [
			{ href: "/studio", label: "My Studio", icon: UserProfile, isLocked: isStudioLocked },
			{
				href: `/artist-studio/${artistMe.id}/setting?tab=profile`,
				label: "Artist Info",
				icon: ArtistInfo,
				isLocked: false,
			},
			{ href: "/payouts", label: "Payouts", icon: Dollars, isLocked: true },
		];
	}, [isArtistMeSuccess, artistMe]);

	const router = useRouter();

	const onUpload = () => {
		if (!profileData) {
			setIsProfileWarningOpen(true);
			return;
		}

		// TODO: 실제 파일 업로드 로직 구현
	};

	const onMoveToProfileSetting = () => {
		setIsProfileWarningOpen(false);
		router.push("/artist-studio/1/setting?tab=profile");
	};

	const onLockedNavClick = () => {
		setIsLockedNavWarningOpen(true);
	};

	return (
		<>
			<div className="flex flex-col flex-1 h-full gap-8px">
				<div className="flex-none px-13px pt-19px">
					<Image
						src="/assets/logo.png"
						alt="로고"
						width={120}
						height={67}
					/>
				</div>

				<aside className="w-[300px] border-r-2 bg-hbc-white border-hbc-red pb-16px">
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
							onClick={onUpload}
						>
							<Upload className="transition-opacity hover:opacity-80" />
							<span className="text-[#FF1900] text-[13px] font-extrabold">Drop Your Fire🔥</span>
						</div>

						<nav className="flex flex-col w-full gap-10px pt-11px pb-6px border-y-6px border-hbc-red">
							{navItems.map(({ href, label, icon, isLocked }) => (
								<NavLink
									key={label}
									href={href}
									label={label}
									Icon={icon}
									isLocked={isLocked}
									onClick={isLocked ? onLockedNavClick : undefined}
								/>
							))}
						</nav>
					</section>
				</aside>
			</div>

			<Popup
				open={isProfileWarningOpen}
				onOpenChange={setIsProfileWarningOpen}
			>
				<PopupContent>
					<PopupHeader>
						<PopupTitle className="font-bold">프로필 설정 완료 후 사용 가능합니다!</PopupTitle>
					</PopupHeader>

					<PopupDescription className="text-center font-bold">
						아래 경로를 통해서 프로필 설정을 완료해 주세요! <br />[ Artist Info ] 👉🏼 [ 프로필 설정 ]
					</PopupDescription>

					<PopupFooter>
						<Button
							rounded="full"
							onClick={onMoveToProfileSetting}
						>
							프로필 설정으로 이동
						</Button>
					</PopupFooter>
				</PopupContent>
			</Popup>

			<Popup
				open={isLockedNavWarningOpen}
				onOpenChange={setIsLockedNavWarningOpen}
			>
				<PopupContent>
					<PopupHeader>
						<PopupTitle className="font-bold">판매자 정보 입력은 필수입니다!</PopupTitle>
					</PopupHeader>

					<PopupDescription className="text-center">
						<span className="font-bold">[프로필 설정]</span>과 <span className="font-bold">[정산정보 설정]</span>을
						완료해 <br />
						판매를 시작해 보세요!
					</PopupDescription>
				</PopupContent>
			</Popup>
		</>
	);
};
