import { memo } from "react";

/**
 * 구독 가격 표시 컴포넌트
 */
interface SubscribePriceProps {
	isSubscribed: boolean;
	recurringPeriod: "monthly" | "yearly";
}

export const SubscribePrice = memo(({ isSubscribed, recurringPeriod }: SubscribePriceProps) => {
	if (isSubscribed) {
		if (recurringPeriod === "yearly") {
			return (
				<div className="justify-start text-hbc-red text-20px font-extrabold font-suit leading-150% tracking-02px">
					20% 할인 혜택 적용 중
				</div>
			);
		}

		if (recurringPeriod === "monthly") {
			return <></>;
		}
	}

	if (recurringPeriod === "yearly") {
		return (
			<div className="inline-flex flex-col items-start justify-start">
				<div className="inline-flex justify-start items-center gap-[5px]">
					<div className="justify-start text-12px font-semibold leading-137% tracking-012px text-neutral-600/80 font-suit">
						{" "}
						239,880원 / 년{" "}
					</div>
					<div className="justify-start text-hbc-red text-8px font-semibold leading-150% tracking-008px font-suit">
						(20% 할인)
					</div>
				</div>
				<div className="inline-flex items-center justify-center gap-10px">
					<div className="justify-start text-20px font-extrabold leading-140% tracking-02px text-hbc-red font-suit">
						19,990원 / 월
					</div>
				</div>
			</div>
		);
	}

	if (recurringPeriod === "monthly") {
		return (
			<div className="inline-flex flex-col items-start justify-start">
				<div className="justify-start text-12px font-semibold leading-150% tracking-012px text-hbc-red font-suit">
					연간 결제 시 19,990원 / 월{" "}
				</div>
				<div className="inline-flex justify-center items-center gap-2.5">
					<div className="justify-start text-20px font-extrabold leading-140% tracking-02px text-hbc-black font-suit">
						24,990원 / 월
					</div>
				</div>
			</div>
		);
	}

	return null;
});

SubscribePrice.displayName = "SubscribePrice";
