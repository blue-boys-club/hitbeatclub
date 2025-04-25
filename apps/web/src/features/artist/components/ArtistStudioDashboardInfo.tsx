import React from "react";

const ArtistStudioDashboardInfo = () => {
	return (
		<section className="pt-8 grid grid-cols-[1fr_2.5fr] gap-x-4 gap-y-3">
			<div className="border-b-6 border-hbc-black text-hbc-black font-bold text-2xl pl-[2px] pb-2">Information</div>

			<div className="border-b-6 border-hbc-black text-hbc-black font-bold text-2xl"></div>
			<div></div>
			<div className="border-b-6 border-hbc-black flex flex-col gap-[2px] pl-[2px] pb-3">
				<div className="text-hbc-black font-suit text-[16px] font-bold leading-[160%] tracking-[-0.32px]">
					가입일: 2024.11.15
				</div>
				<div className="text-hbc-black font-suit text-[16px] font-bold leading-[160%] tracking-[-0.32px]">
					구독일: 3달
				</div>
				<div className="text-hbc-black font-suit text-[16px] font-bold leading-[160%] tracking-[-0.32px]">
					총 트랙 수: 8
				</div>
				<div className="text-hbc-black font-suit text-[16px] font-bold leading-[160%] tracking-[-0.32px]">
					총 팔로워 수: 642
				</div>
				<div className="text-hbc-black font-suit text-[16px] font-bold leading-[160%] tracking-[-0.32px]">
					판매한 트랙 수: 22개
				</div>
			</div>
		</section>
	);
};

export default ArtistStudioDashboardInfo;
