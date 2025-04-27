"use client";

import { Dollars } from "@/assets/svgs";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ArtistStudioPayoutWithdrawInformationModal } from "./modal/ArtistStudioPayoutWithdrawInformationModal";

interface ArtistStudioPayoutDashboardProps {
	artistId: string;
}

const ArtistStudioPayoutDashboard = ({ artistId }: ArtistStudioPayoutDashboardProps) => {
	const { data: artist } = useQuery({
		queryKey: ["TODO", "artist", "payout", artistId],
		queryFn: () => {
			// return fetch(`/api/artist/${artistId}/payout`).then((res) => res.json());
			return Promise.resolve({
				totalIncome: 132000,
				totalWithdrawal: 100000,
				availableBalance: 100000,
				totalSettlementWaiting: 3125000,
				accountBank: "신한",
				accountNumber: "110-121-1512345",
				accountHolder: "김일상",
			});
		},
	});

	return (
		<div className="flex flex-col mt-57px gap-78px">
			<div className="self-stretch px-20 py-10 border-l-[3px] border-r-[3px] border-t-4 border-b-4 border-black flex flex-col lg:flex-row items-start lg:items-center justify-start gap-10 lg:gap-36">
				<div className="inline-flex flex-col items-start justify-start gap-4">
					<div className="inline-flex items-center self-stretch justify-start gap-20">
						<div className="justify-start text-24px font-bold leading-100% tracking-024px text-black font-suit">
							누적 수입 금액
						</div>
						<div className="flex items-center justify-start gap-4 size-">
							<div className="justify-start text-black text-3xl font-black font-suisse leading-100% tracking-024px">
								{artist?.totalIncome?.toLocaleString() || "0"}
							</div>
							<div className="justify-start text-24px font-semibold leading-100% tracking-024px text-black font-suit">
								원
							</div>
						</div>
					</div>
					<div className="inline-flex items-center self-stretch justify-between">
						<div className="justify-start text-24px font-bold leading-100% tracking-024px text-black font-suit">
							누적 출금 금액
						</div>
						<div className="flex items-center justify-start gap-4 size-">
							<div className="justify-start text-black text-3xl font-black font-suisse leading-100% tracking-024px">
								{artist?.totalWithdrawal?.toLocaleString() || "0"}
							</div>
							<div className="justify-start text-24px font-semibold leading-100% tracking-024px text-black font-suit">
								원
							</div>
						</div>
					</div>
					<div className="inline-flex items-center self-stretch justify-start gap-20">
						<div className="justify-start text-24px font-bold leading-100% tracking-024px text-black font-suit">
							정산 가능 금액
						</div>
						<div className="flex items-center justify-start gap-4 size-">
							<div className="justify-start text-black text-3xl font-black font-suisse leading-100% tracking-024px">
								{artist?.availableBalance?.toLocaleString() || "0"}
							</div>
							<div className="justify-start text-24px font-semibold leading-100% tracking-024px text-black font-suit">
								원
							</div>
						</div>
					</div>
				</div>
				<div className="inline-flex flex-col items-start self-stretch justify-start gap-4">
					<div className="inline-flex items-center justify-between w-full lg:w-380px">
						<div className="justify-start text-24px font-bold leading-100% tracking-024px text-black font-suit">
							정산 계좌
						</div>
						<div className="justify-start text-24px font-semibold leading-100% tracking-024px text-black font-suit">
							{artist?.accountBank} {artist?.accountNumber}
						</div>
					</div>
					<div className="inline-flex items-center justify-between w-full lg:w-380px">
						<div className="justify-start text-24px font-bold leading-100% tracking-024px text-black font-suit">
							예금주
						</div>
						<div className="justify-start text-24px font-semibold leading-100% tracking-024px text-black font-suit">
							{artist?.accountHolder}
						</div>
					</div>
				</div>
			</div>

			<div className="flex flex-col items-center justify-center w-full">
				<div className="flex flex-col justify-start items-center gap-2.5">
					<div className="p-4 bg-hbc-white rounded-[5px] border-l border-r border-t-2 border-b-2 border-[#FF1900] flex justify-center items-center gap-4 w-full">
						<Dollars
							className="w-10 h-10"
							fill="#FF1900"
						/>
						<div className="justify-center text-3xl font-extrabold leading-tight tracking-tight text-center text-[#FF1900] font-suit">
							정산 예정 금액 {artist?.totalSettlementWaiting?.toLocaleString() || "0"} 원
						</div>
					</div>
					<div className="w-[475px] inline-flex justify-between items-start">
						<div className="inline-flex flex-col items-start justify-center size-">
							<div className="justify-center text-center">
								<span className="text-xs font-bold leading-tight tracking-tight text-hbc-gray-400 font-suit">
									최소 출금 금액
								</span>
								<span className="text-xs font-100% leading-tight tracking-tight text-hbc-gray-400 font-suit"> : </span>
								<span className="text-xs font-bold leading-tight tracking-tight text-hbc-gray-400 font-suit">
									50,000 KRW
								</span>
							</div>
							<div className="justify-center text-xs font-bold leading-tight tracking-tight text-center text-hbc-gray-400 font-suit">
								카드 수수료 및 세금은 제외한 금액입니다.
							</div>
						</div>
						<div className="size- px-3 py-[3px] bg-[#FF1900] rounded-[5px] flex justify-start items-start gap-0.5">
							<ArtistStudioPayoutWithdrawInformationModal>
								<button className="justify-start text-base font-bold leading-100% tracking-tight text-hbc-white font-suit cursor-pointer">
									정산 안내
								</button>
							</ArtistStudioPayoutWithdrawInformationModal>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ArtistStudioPayoutDashboard;
