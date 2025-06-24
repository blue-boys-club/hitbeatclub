"use client";

import { Dollars } from "@/assets/svgs";
import { SubscribeHBCLogo } from "@/features/subscribe/components";
import { Toggle } from "@/components/ui/Toggle/Toggle";
import { useState } from "react";
import { LogoGray } from "@/assets/svgs/LogoGray";
import { MembershipInformationModal, UnsubscribeModal } from "@/features/mobile/subscribe/modals";

export const MobileSubscribePage = () => {
	const [isMonthly, setIsMonthly] = useState(false); // false: 연간구독, true: 월간구독
	const [isMembershipInformationModalOpen, setIsMembershipInformationModalOpen] = useState(false);
	const [isUnsubscribeModalOpen, setIsUnsubscribeModalOpen] = useState(false);
	return (
		<div className="flex flex-col">
			<div className="px-4 pb-4 flex gap-2 items-center">
				<Dollars
					width={23}
					height={23}
				/>
				<span className="font-bold text-22px leading-100%">Subscribe</span>
			</div>
			<div className="h-161px bg-black flex flex-col justify-center items-center text-white">
				<SubscribeHBCLogo
					width={175}
					height={18}
				/>
				<span className="font-semibold text-27px leading-80% mt-14px">ROAD TO THE HITMAKER</span>
				<span className="font-black text-16px leading-140% mt-4 text-center">
					자유로운 음악 생활,
					<br />
					히트비트클럽 멤버쉽과 함께하세요
				</span>
			</div>
			<div className="pt-19px px-4 pb-25px flex flex-col gap-25px">
				<div className="flex justify-between">
					<span className="font-semibold text-27px leading-80%">PREMIUM</span>
					<div className="flex gap-10px items-center">
						<span
							className={`font-extrabold text-14px leading-100% ${!isMonthly ? "text-black" : "text-hbc-gray-300"}`}
						>
							연간 구독
						</span>
						<Toggle
							checked={isMonthly}
							onChange={(e) => setIsMonthly(e.target.checked)}
							mobile={true}
							toggleClassName="bg-black peer-checked:bg-black after:bg-white"
						/>
						<span className={`font-extrabold text-14px leading-100% ${isMonthly ? "text-black" : "text-hbc-gray-300"}`}>
							월간 구독
						</span>
					</div>
				</div>
				<div className="flex flex-col gap-5px">
					<span className="font-extrabold text-14px leading-28px">
						요금제를 구독하시면 다음과 같은 혜택을 누리실 수 있습니다.
					</span>
					<div className="flex flex-col font-semibold text-12px leading-160%">
						<span>- 0% 판매자 서비스 이용 수수료 (카드 수수료 및 세금 별도)</span>
						<span>- 무제한 MP3 및 WAV 업로드</span>
						<span>- 스템 업로드</span>
						<span>- 상위 노출 크레딧 월 5회 (연간 플랜만 해당)</span>
						<span>- 비밀 수익 모델 기회 제공 (구독 후 내부 심사 기준 충족 시 수익 모델 제공)</span>
						<span>- 마스터권 판매 가능</span>
					</div>
				</div>
				<div className="flex flex-col">
					<span className="font-semibold text-12px leading-150%">월간 결제 시, 매월 25,000원</span>
					<span className="font-semibold text-18px leading-28px text-hbc-red">
						매월 20,000원&nbsp;&nbsp;<span className="text-12px leading-150%">(20% 할인)</span>
					</span>
					<div className="mt-20px flex flex-col">
						<button
							className="w-full bg-black rounded-30px h-27px text-white font-extrabold text-12px leading-100%"
							onClick={() => setIsMembershipInformationModalOpen(true)}
						>
							멤버쉽 가입하기
						</button>
						<button
							className="mt-5px font-semibold text-12px leading-160% text-end text-hbc-gray-300"
							onClick={() => setIsUnsubscribeModalOpen(true)}
						>
							구독 취소하기
						</button>
					</div>
				</div>
				<LogoGray className="w-full" />
			</div>
			<MembershipInformationModal
				isOpen={isMembershipInformationModalOpen}
				onClose={() => setIsMembershipInformationModalOpen(false)}
				plan={isMonthly ? "MONTH" : "YEAR"}
			/>
			<UnsubscribeModal
				isOpen={isUnsubscribeModalOpen}
				onClose={() => setIsUnsubscribeModalOpen(false)}
			/>
		</div>
	);
};
