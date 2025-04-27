import { Button } from "@/components/ui/Button";
import Link from "next/link";
import React from "react";

const UserAccountSubscribe = () => {
	return (
		<section className="flex items-start justify-between px-8 pt-4">
			{true ? (
				<>
					<div className="text-[16px] leading-[160%] tracking-[-0.32px] font-extrabold text-black">
						HITBEATCLUB 님은, PREMIUM 이용자입니다. <br />
						다음 결제일은 24.12.15일입니다.
					</div>

					<Button
						variant={"outline"}
						rounded={"full"}
						fontWeight={"extraBold"}
						className="border-3"
					>
						{"구독 중인 상품 확인"}
					</Button>
				</>
			) : (
				<>
					<div className="text-[16px] leading-[160%] tracking-[-0.32px] font-extrabold text-black">
						HITBEATCLUB 님은, 아직 구독중인 이용권이 없습니다.
					</div>

					<Link href="/subscribe">
						<Button
							variant={"fill"}
							rounded={"full"}
							fontWeight={"extraBold"}
							className="border-3 bg-[#FF1900] hover:bg-[#FF1900]/80"
						>
							{"요금제 구독하기"}
						</Button>
					</Link>
				</>
			)}
		</section>
	);
};

export default UserAccountSubscribe;
