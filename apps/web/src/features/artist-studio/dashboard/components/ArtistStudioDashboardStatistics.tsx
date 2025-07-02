"use client";

import { getArtistMeQueryOption, getArtistStatisticsQueryOption } from "@/apis/artist/query/artist.query-options";
import { Plus } from "@/assets/svgs";
import { AlbumAvatar, UserAvatar } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useMemo } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { COUNTRY_CODE_TO_NAME_MAP_KO, CountryCode } from "@hitbeatclub/country-options";
import countries from "i18n-iso-countries";

interface StatisticsListMainItemProps {
	imageUrl: string;
	title: string;
}

const StatisticsListMainItem = ({ imageUrl, title }: StatisticsListMainItemProps) => {
	return (
		<div className="flex flex-col gap-2 items-center">
			<AlbumAvatar src={imageUrl ?? ""} />
			<div className="text-[20px] leading-[24px] tracking-[0.2px] font-bold text-hbc-black">{title}</div>
		</div>
	);
};

interface StatisticsListOtherItemProps {
	index: number;
	imageUrl: string;
	title: string;
}

const StatisticsListOtherItem = ({ index, imageUrl, title }: StatisticsListOtherItemProps) => {
	return (
		<div className="flex flex-col gap-2 justify-center items-center">
			<div className="text-hbc-black text-center font-[SUIT] text-[12px] font-black leading-[120%] tracking-[0.12px]">
				{index + 2}위
			</div>
			<UserAvatar
				src={imageUrl ?? ""}
				size="large"
				className="w-[85px] h-[85px] border-4 border-hbc-black"
			/>
			<div className="text-hbc-black text-center font-[Suisse] text-[12px] font-bold leading-[120%] tracking-[0.12px]">
				{title}
			</div>
		</div>
	);
};

const ArtistStudioDashboardStatistics = () => {
	const [isOpen, setIsOpen] = useState(false);

	const { data: artist } = useQuery(getArtistMeQueryOption());
	const { data: statistics } = useQuery({
		...getArtistStatisticsQueryOption(Number(artist?.id)),
		enabled: !!artist?.id,
	});

	const mostLikedTracksWithoutFirst = useMemo(
		() => statistics?.mostLikedTracks?.slice(1),
		[statistics?.mostLikedTracks],
	);
	const mostPlayedTracksWithoutFirst = useMemo(
		() => statistics?.mostPlayedTracks?.slice(1),
		[statistics?.mostPlayedTracks],
	);
	const topCountriesWithoutFirst = useMemo(() => statistics?.topCountries?.slice(1), [statistics?.topCountries]);

	const convertAlpha3ToAlpha2 = (alpha3Code: string) => {
		if (!alpha3Code) return null;
		const alpha2Code = countries.alpha3ToAlpha2(alpha3Code);
		return alpha2Code?.toLowerCase() ?? "us";
	};

	return (
		<section className="pt-8 grid grid-cols-[1fr_2.5fr] gap-x-4 gap-y-3">
			<div className="border-b-6 pl-[2px] pb-2 text-hbc-black font-suit text-[24px] font-extrabold leading-[100%] tracking-[0.24px]">
				트랙 통계
			</div>

			{/* divider */}
			<div className="border-b-6 border-hbc-black text-hbc-black font-bold text-2xl"></div>

			<div></div>

			<Collapsible.Root
				open={isOpen}
				onOpenChange={setIsOpen}
			>
				<div className="border-b-6 border-hbc-black flex flex-col gap-7 pb-[28px]">
					<div className="grid grid-cols-3 gap-auto pt-[18px] pb-3">
						{/* 가장 좋아요를 많이 받은 트랙 */}
						<div className="flex flex-col gap-2 items-center">
							<div className="text-[16px] leading-[160%] tracking-[-0.32px] font-bold text-hbc-black font-[SUIT]">
								가장 좋아요를 많이 받은 트랙
							</div>
							<div className="flex gap-1.5">
								<span className="text-[32px] leading-[24px] tracking-[0.32px] font-bold text-hbc-black">
									{statistics?.mostLikedTracks[0]?.likeCount.toLocaleString()}
								</span>
								<span className="text-[20px] leading-[24px] tracking-[0.2px] font-medium text-hbc-gray-300">Like</span>
							</div>

							<div className="flex flex-col gap-7">
								{/* 1위 */}
								<StatisticsListMainItem
									title={statistics?.mostLikedTracks[0]?.productName ?? ""}
									imageUrl={statistics?.mostLikedTracks[0]?.imageUrl ?? ""}
								/>

								{/* 2위 이후 - 2x2 그리드 */}
								<Collapsible.Content asChild>
									<div className="grid grid-cols-2 gap-4">
										{mostLikedTracksWithoutFirst?.slice(0, 4).map((item, index) => (
											<StatisticsListOtherItem
												key={index}
												index={index}
												imageUrl={item.imageUrl ?? ""}
												title={item.productName ?? ""}
											/>
										))}
									</div>
								</Collapsible.Content>
							</div>
						</div>

						{/* 한 달 간 가장 재생이 많은 국가 */}
						<div className="flex flex-col gap-2 items-center">
							<div className="text-[16px] leading-[160%] tracking-[-0.32px] font-bold text-hbc-black font-[SUIT]">
								한 달 간 가장 재생이 많은 국가
							</div>
							<div className="flex gap-1.5">
								<span className="text-[32px] leading-[24px] tracking-[0.32px] font-bold text-hbc-black">
									{statistics?.topCountries[0]?.percentage}
								</span>
								<span className="text-[20px] leading-[24px] tracking-[0.2px] font-medium text-hbc-gray-300">%</span>
							</div>

							<div className="flex flex-col gap-7">
								{/* 1위 */}
								<StatisticsListMainItem
									title={statistics?.topCountries[0]?.countryCode ?? ""}
									imageUrl={`https://flagcdn.com/${convertAlpha3ToAlpha2(statistics?.topCountries[0]?.countryCode ?? "")}.svg`}
								/>

								{/* 2위 이후 - 2x2 그리드 */}
								<Collapsible.Content asChild>
									<div className="grid grid-cols-2 gap-4">
										{topCountriesWithoutFirst?.slice(0, 4).map((item, index) => (
											<StatisticsListOtherItem
												key={index}
												index={index}
												imageUrl={`https://flagcdn.com/${convertAlpha3ToAlpha2(item.countryCode)}.svg`}
												title={COUNTRY_CODE_TO_NAME_MAP_KO[item.countryCode as CountryCode]}
											/>
										))}
									</div>
								</Collapsible.Content>
							</div>
						</div>

						{/* 가장 많이 재생된 트랙 */}
						<div className="flex flex-col gap-2 items-center">
							<div className="text-[16px] leading-[160%] tracking-[-0.32px] font-bold text-hbc-black font-[SUIT]">
								가장 많이 재생된 트랙
							</div>
							<div className="flex gap-1.5">
								<span className="text-[32px] leading-[24px] tracking-[0.32px] font-bold text-hbc-black">
									{statistics?.mostPlayedTracks[0]?.viewCount?.toLocaleString() ?? 0}
								</span>
								<span className="text-[20px] leading-[24px] tracking-[0.2px] font-medium text-hbc-gray-300">재생</span>
							</div>

							<div className="flex flex-col gap-7">
								{/* 1위 */}
								<StatisticsListMainItem
									title={statistics?.mostPlayedTracks[0]?.productName ?? ""}
									imageUrl={statistics?.mostPlayedTracks[0]?.imageUrl ?? ""}
								/>

								{/* 2위 이후 - 2x2 그리드 */}
								<Collapsible.Content asChild>
									<div className="grid grid-cols-2 gap-4">
										{mostPlayedTracksWithoutFirst?.slice(0, 4).map((item, index) => (
											<StatisticsListOtherItem
												key={index}
												index={index}
												imageUrl={item.imageUrl ?? ""}
												title={item.productName ?? ""}
											/>
										))}
									</div>
								</Collapsible.Content>
							</div>
						</div>
					</div>

					<div className="flex items-center justify-center">
						<Button
							rounded={"full"}
							onClick={() => setIsOpen(!isOpen)}
							className="hover:bg-[#FF1900]"
						>
							{!isOpen ? (
								<div className="flex items-center gap-1">
									<div className="text-center font-[SUIT] text-[16px] font-extrabold leading-[100%] tracking-[0.16px] text-hbc-white ">
										더보기
									</div>
									<Plus />
								</div>
							) : (
								<div className="flex items-center gap-1">
									<div className="text-center font-[SUIT] text-[16px] font-extrabold leading-[100%] tracking-[0.16px] text-hbc-white">
										접기
									</div>
									<div className="rotate-45">
										<Plus />
									</div>
								</div>
							)}
						</Button>
					</div>
				</div>
			</Collapsible.Root>
		</section>
	);
};

export default ArtistStudioDashboardStatistics;
