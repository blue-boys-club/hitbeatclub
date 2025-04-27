"use client";

import { cn } from "@/common/utils";

type UserInfo = {
	name: string;
	email: string;
	phone: string;
	address: string;
};

type OrderUserInfoProps = {
	userInfo: UserInfo;
};

/**
 * 주문자 정보 섹션을 표시하는 컴포넌트입니다.
 */
export const OrderUserInfo = ({ userInfo }: OrderUserInfoProps) => {
	return (
		<div className={cn("w-full flex flex-col justify-start items-start gap-2.5 pt-4 border-t border-hbc-black/20")}>
			<div className={cn("self-stretch text-hbc-black text-16px font-bold font-suit leading-normal")}>구매 정보</div>
			<div className={cn("self-stretch inline-flex flex-wrap justify-start items-center gap-x-16 gap-y-2")}>
				<div className={cn("min-w-32px inline-flex flex-col justify-start items-start gap-0.5")}>
					<div className={cn("self-stretch text-hbc-black text-12px font-bold font-suit leading-none tracking-tight")}>
						이름
					</div>
					<div
						className={cn("self-stretch text-hbc-gray-400 text-12px font-bold font-suit leading-none tracking-tight")}
					>
						{userInfo.name}
					</div>
				</div>
				<div className={cn("min-w-[192px] inline-flex flex-col justify-start items-start gap-0.5")}>
					<div className={cn("self-stretch text-hbc-black text-12px font-bold font-suit leading-none tracking-tight")}>
						이메일
					</div>
					<div
						className={cn(
							"self-stretch text-hbc-gray-400 text-12px font-medium font-suisse leading-none tracking-tight",
						)}
					>
						{userInfo.email}
					</div>
				</div>
				<div className={cn("min-w-96px inline-flex flex-col justify-start items-start gap-0.5")}>
					<div className={cn("self-stretch text-hbc-black text-12px font-bold font-suit leading-none tracking-tight")}>
						연락처
					</div>
					<div
						className={cn(
							"self-stretch text-hbc-gray-400 text-12px font-medium font-suisse leading-none tracking-tight",
						)}
					>
						{userInfo.phone}
					</div>
				</div>
				<div className={cn("min-w-[208px] inline-flex flex-col justify-start items-start gap-0.5")}>
					<div className={cn("self-stretch text-hbc-black text-12px font-bold font-suit leading-none tracking-tight")}>
						주소
					</div>
					<div
						className={cn("self-stretch text-hbc-gray-400 text-12px font-bold font-suit leading-none tracking-tight")}
					>
						{userInfo.address}
					</div>
				</div>
			</div>
		</div>
	);
};
