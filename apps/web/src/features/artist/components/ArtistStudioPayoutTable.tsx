"use client";

import Link from "next/link";
import SettlementTable from "./ArtsitStudioPayoutSettlementTable";
import ReferralTable from "./ArtistStudioPayoutReferralTable";
import TransactionTable from "./ArtistStudioPayoutTransactionTable";
import { ArtistStudioPayoutContactModal } from "./modal/ArtistStudioPayoutContactModal";

interface ArtistStudioPayoutTableProps {
	artistId: string;
	type: "settlements" | "referrals" | "transactions";
}

const TABS = [
	{
		label: "거래내역",
		value: "transactions",
	},
	{
		label: "레퍼럴 내역",
		value: "referrals",
	},
	{
		label: "정산 내역",
		value: "settlements",
	},
];

const ArtistStudioPayoutTable = ({ artistId, type }: ArtistStudioPayoutTableProps) => {
	const getTabClassName = (tabValue: string) => {
		return `justify-start text-2xl font-bold leading-normal tracking-tight font-suit ${type === tabValue ? "text-black" : "text-stone-300 hover:text-stone-400"}`;
	};

	const renderTable = () => {
		switch (type) {
			case "transactions":
				return <TransactionTable artistId={artistId} />;
			case "referrals":
				return <ReferralTable artistId={artistId} />;
			case "settlements":
			default:
				return <SettlementTable artistId={artistId} />;
		}
	};

	return (
		<div className="flex flex-col items-end self-stretch justify-start gap-2.5 mt-80px mb-40px">
			<div className="inline-flex items-end justify-between w-full">
				<ArtistStudioPayoutContactModal
					type={type}
					artistId={artistId}
				>
					<button className="justify-start text-base font-normal leading-normal tracking-tight text-blue-700 underline cursor-pointer underline-offset-2 font-suit hover:text-blue-900">
						문의
					</button>
				</ArtistStudioPayoutContactModal>
				<button
					className="px-3 py-[3px] bg-black rounded-[5px] flex justify-center items-center gap-0.5 text-white text-base font-normal font-suit leading-normal tracking-tight hover:bg-gray-800 cursor-pointer"
					onClick={() => {
						alert("내역 저장 개발 예정");
					}}
				>
					내역 저장
				</button>
			</div>
			<div className="flex flex-col items-center justify-start w-full gap-3 px-15px py-20px min-h-[400px] outline-4 -outline-offset-2 outline-hbc-black">
				<div className="w-[709px] inline-flex justify-between items-center">
					{TABS.map((tab) => (
						<Link
							key={tab.value}
							href={`/artist-studio/${artistId}/${tab.value}`}
							scroll={false}
							className={getTabClassName(tab.value)}
							aria-current={type === tab.value ? "page" : undefined}
						>
							{tab.label}
						</Link>
					))}
				</div>
				{renderTable()}
			</div>
		</div>
	);
};

export default ArtistStudioPayoutTable;
