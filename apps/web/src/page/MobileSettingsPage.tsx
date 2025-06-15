"use client";

import { ArrowLeftShort, Outlink } from "@/assets/svgs";
import { Checkbox, Toggle } from "@/components/ui";
import { MobileSettingsPageTitle, MobileSettingsSelect } from "@/features/mobile/settings/components";
import { useState } from "react";

export const MobileSettingsPage = () => {
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [gender, setGender] = useState("");
	const [country, setCountry] = useState("");
	const [region, setRegion] = useState("");

	return (
		<div className="flex flex-col px-4 pb-6">
			<MobileSettingsPageTitle title="Settings" />
			{isSubscribed ? (
				<div className="mt-13px flex flex-col gap-2">
					<div className="flex flex-col font-bold text-12px leading-160%">
						<span>HITBEATCLUB 님은, PREMIUM 이용자입니다.</span>
						<span>다음 결제일은 24.12.15일입니다.</span>
					</div>
					<div className="flex gap-1">
						<button className="flex-1 h-22px rounded-30px bg-hbc-gray-100 font-extrabold text-10px leading-100%">
							요금제 변경하기
						</button>
						<button className="flex-1 h-22px rounded-30px bg-hbc-gray-100 font-extrabold text-10px leading-100%">
							결제수단 변경하기
						</button>
						<button className="flex-1 h-22px rounded-30px bg-hbc-red text-white font-extrabold text-10px leading-100% flex items-center justify-center gap-1">
							<span>ARTIST STUDIO</span>
							<div className="w-13px h-13px rounded-full bg-white flex items-center justify-center">
								<ArrowLeftShort
									width="9px"
									height="9px"
									fill="red"
								/>
							</div>
						</button>
					</div>
				</div>
			) : (
				<div className="mt-13px flex justify-between items-center">
					<span className="font-bold text-12px leading-160% tracking-[-0.02em]">
						HITBEATCLUB 님은, 구독중인 이용권이 없습니다.
					</span>
					<button className="h-20px px-10px font-black text-10px leading-100% bg-hbc-red rounded-20px text-white">
						요금제 구독하기
					</button>
				</div>
			)}
			<div className="mt-4 flex flex-col gap-3">
				<div className="flex gap-6px">
					<span className="text-12px font-extrabold leading-160%">기본정보</span>
					<span className="text-12px font-extrabold leading-160%">General Information</span>
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<span className="text-12px font-semibold leading-160%">이메일</span>
						<input
							className="border-b-1px border-black focus:outline-none font-[450] text-12px leading-100% pb-1 placeholder:text-hbc-gray-300"
							placeholder="HITBEATCLUB@GMAIL.COM"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-12px font-semibold leading-160%">휴대전화</span>
						<input
							className="border-b-1px border-black focus:outline-none font-[450] text-12px leading-100% pb-1 placeholder:text-hbc-gray-300"
							placeholder="010-1234-5678"
						/>
					</div>
					<div className="flex flex-col gap-10px">
						<div className="flex gap-3px">
							<div className="flex-1 flex flex-col gap-1">
								<span className="font-semibold text-12px leading-160%">이름</span>
								<input className="w-full px-1 h-22px bg-[#dfdfdf] rounded-2px focus:outline-none text-12px leading-100% font-semibold min-w-0" />
							</div>
							<div className="flex-1 flex flex-col gap-1">
								<span className="font-semibold text-12px leading-160%">활동명</span>
								<input className="w-full px-1 h-22px bg-[#dfdfdf] rounded-2px focus:outline-none text-12px leading-100% font-semibold min-w-0" />
							</div>
						</div>
						<div className="flex flex-col gap-1">
							<span className="font-semibold text-12px leading-160%">생년월일</span>
							<div className="flex gap-5px">
								<input className="flex-1 px-1 h-22px bg-[#dfdfdf] rounded-2px focus:outline-none text-12px leading-100% font-semibold min-w-0" />
								<input className="flex-1 px-1 h-22px bg-[#dfdfdf] rounded-2px focus:outline-none text-12px leading-100% font-semibold min-w-0" />
								<input className="flex-1 px-1 h-22px bg-[#dfdfdf] rounded-2px focus:outline-none text-12px leading-100% font-semibold min-w-0" />
							</div>
						</div>
						<MobileSettingsSelect
							label="성별"
							options={["남성", "여성", "기타"]}
							value={gender}
							onChange={setGender}
							className="w-178px"
						/>
						<div className="flex gap-1">
							<MobileSettingsSelect
								label="국가"
								options={["대한민국", "미국", "일본", "중국", "기타"]}
								value={country}
								onChange={setCountry}
								className="flex-1"
							/>
							<MobileSettingsSelect
								label="지역"
								options={[
									"서울",
									"부산",
									"대구",
									"인천",
									"광주",
									"대전",
									"울산",
									"세종",
									"경기",
									"강원",
									"충북",
									"충남",
									"전북",
									"전남",
									"경북",
									"경남",
									"제주",
								]}
								value={region}
								onChange={setRegion}
								className="flex-1"
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="mt-14px flex justify-end">
				<button className="px-1 h-19px font-semibold text-12px leading-160% rounded-2px bg-[#dfdfdf]">
					비밀번호 변경
				</button>
			</div>
			<div className="mt-3 flex gap-1 font-semibold text-12px leading-150%">
				<Checkbox id="marketing-consent" />
				<label
					htmlFor="marketing-consent"
					className="transform -translate-y-2px"
				>
					마케팅 목적을 위해 HITBEATCLUB의 콘텐츠 제공자에게 내 등록 데이터를 공유하겠습니다.
				</label>
			</div>
			<div className="mt-4 flex flex-col gap-3">
				<div className="flex gap-6px font-extrabold text-12px leading-160%">
					<span>디스플레이</span>
					<span>Display</span>
				</div>
				<div className="flex justify-between items-center">
					<span className="font-semibold text-12px leading-100%">다크모드</span>
					<Toggle mobile />
				</div>
			</div>
			<div className="mt-4 flex flex-col gap-3">
				<div className="flex gap-6px font-extrabold text-12px leading-160%">
					<span>도움말</span>
					<span>Help</span>
				</div>
				<div className="flex flex-col gap-2 font-semibold text-12px leading-160%">
					<div className="flex gap-1 items-center">
						<span>고객 센터</span>
						<Outlink className="transform -translate-y-1px" />
					</div>
					<div className="flex gap-1 items-center">
						<span>회사 소개</span>
						<Outlink className="transform -translate-y-1px" />
					</div>
				</div>
				<div className="mt-4 flex justify-center">
					<button className="bg-black h-27px px-15px flex items-center font-extrabold text-12px leading-100% rounded-30px text-white">
						변경사항 저장
					</button>
				</div>
			</div>
		</div>
	);
};
