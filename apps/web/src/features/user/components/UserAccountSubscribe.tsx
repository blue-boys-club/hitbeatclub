"use client";

import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";
import { Button } from "@/components/ui/Button";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useMemo } from "react";

const UserAccountSubscribe = () => {
	const { data: user } = useQuery(getUserMeQueryOption());

	const isMembership = useMemo(() => {
		return !!user?.subscribedAt;
	}, [user?.subscribedAt]);

	const nextPaymentDate = useMemo(() => {
		if (!user?.subscribedAt) return null;

		const date = new Date(user.subscribedAt);
		date.setMonth(date.getMonth() + 1);

		return date.toLocaleDateString("ko-KR", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}, [user?.subscribedAt]);

	return (
		<section className="flex items-start justify-between px-8 pt-4">
			{isMembership ? (
				<>
					<div className="text-[16px] leading-[160%] tracking-[-0.32px] font-extrabold text-black">
						{user?.name} 님은, PREMIUM 이용자입니다. <br />
						다음 결제일은 {nextPaymentDate}입니다.
					</div>

					<Button
						variant={"outline"}
						rounded={"full"}
						fontWeight={"extraBold"}
						className="border-3"
					>
						구독 중인 상품 확인
					</Button>
				</>
			) : (
				<>
					<div className="text-[16px] leading-[160%] tracking-[-0.32px] font-extrabold text-black">
						{user?.name} 님은, 아직 구독중인 이용권이 없습니다.
					</div>

					<Link href="/subscribe">
						<Button
							variant={"fill"}
							rounded={"full"}
							fontWeight={"extraBold"}
							className="border-3 bg-[#FF1900] hover:bg-[#FF1900]/80"
						>
							요금제 구독하기
						</Button>
					</Link>
				</>
			)}
		</section>
	);
};

export default UserAccountSubscribe;
