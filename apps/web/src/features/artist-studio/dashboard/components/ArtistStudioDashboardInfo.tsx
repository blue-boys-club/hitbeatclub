"use client";

import { getArtistMeQueryOption } from "@/apis/artist/query/artist.query-options";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React from "react";

const ArtistStudioDashboardInfo = () => {
	const { data: artist } = useQuery(getArtistMeQueryOption());

	// 구독일 계산 함수
	const calculateSubscriptionPeriod = (subscribeDate: string | Date | undefined) => {
		if (!subscribeDate) return null;

		// UTC를 KST로 변환 (UTC + 9시간)
		const startDate = moment(subscribeDate).utc().add(9, "hours");
		const today = moment();

		const diff = today.startOf("day").diff(startDate.startOf("day"), "days");

		if (diff < 30) {
			return `${diff}일`;
		}

		const months = today.diff(startDate, "months");
		const remainingDays = today.diff(startDate.add(months, "months"), "days");

		if (months === 0) {
			return `${remainingDays}일`;
		} else if (remainingDays === 0) {
			return `${months}개월`;
		} else {
			return `${months}개월 ${remainingDays}일`;
		}
	};

	const subscriptionPeriod = calculateSubscriptionPeriod(artist?.subscribe?.createdAt);

	return (
		<section className="pt-8 grid grid-cols-[1fr_2.5fr] gap-x-4 gap-y-3">
			<div className="border-b-6 border-hbc-black text-hbc-black font-bold text-2xl pl-[2px] pb-2">Information</div>

			<div className="border-b-6 border-hbc-black text-hbc-black font-bold text-2xl"></div>
			<div></div>
			<div className="border-b-6 border-hbc-black flex flex-col gap-[2px] pl-[2px] pb-3">
				<div className="text-hbc-black font-suit text-[16px] font-bold leading-[160%] tracking-[-0.32px]">
					가입일: {moment(artist?.createdAt).format("YYYY.MM.DD")}
				</div>
				<div className="text-hbc-black font-suit text-[16px] font-bold leading-[160%] tracking-[-0.32px]">
					구독일: {subscriptionPeriod}
				</div>
				<div className="text-hbc-black font-suit text-[16px] font-bold leading-[160%] tracking-[-0.32px]">
					총 트랙 수: {artist?.trackCount}
				</div>
				<div className="text-hbc-black font-suit text-[16px] font-bold leading-[160%] tracking-[-0.32px]">
					총 팔로워 수: {artist?.followerCount}
				</div>
				<div className="text-hbc-black font-suit text-[16px] font-bold leading-[160%] tracking-[-0.32px]">
					판매한 트랙 수: {artist?.soldTrackCount}개
				</div>
			</div>
		</section>
	);
};

export default ArtistStudioDashboardInfo;
