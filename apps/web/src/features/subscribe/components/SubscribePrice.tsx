import { SubscriptionPlan, SubscribePlansResponse } from "@hitbeatclub/shared-types/subscribe";
import { memo } from "react";
import { formatPrice } from "@/common/utils";

// 스켈레톤 컴포넌트
const PriceSkeleton = () => (
	<div className="inline-flex flex-col items-start justify-start gap-1 animate-pulse">
		<div className="w-80px h-12px bg-gray-200 rounded" />
		<div className="w-100px h-18px bg-gray-200 rounded" />
	</div>
);

/**
 * 구독 가격 표시 컴포넌트
 */
interface SubscribePriceProps {
	isSubscribed: boolean;
	subscriptionPlan: SubscriptionPlan;
	/** 구독 플랜 가격 데이터 */
	subscribePlans?: SubscribePlansResponse;
	/** 가격 정보 로딩 여부 */
	isLoading: boolean;
}

export const SubscribePrice = memo(
	({ isSubscribed, subscriptionPlan, subscribePlans, isLoading }: SubscribePriceProps) => {
		if (isLoading || !subscribePlans) {
			return <PriceSkeleton />;
		}

		const yearPlan = subscribePlans["YEAR"];
		const monthPlan = subscribePlans["MONTH"];
		const currentPlan = subscribePlans[subscriptionPlan];

		// 구독 중인 경우 간단 메시지 (연간 구독 할인 적용 등)
		if (isSubscribed) {
			if (subscriptionPlan === "YEAR" && yearPlan?.discountRate) {
				return (
					<div className="justify-start text-hbc-red text-20px font-extrabold font-suit leading-150% tracking-02px">
						{yearPlan.discountRate}% 할인 혜택 적용 중
					</div>
				);
			}
			return null;
		}

		// 연간 구독 가격 표시
		if (subscriptionPlan === "YEAR") {
			return (
				<div className="inline-flex flex-col items-start justify-start">
					{currentPlan && (
						<>
							<div className="inline-flex justify-start items-center gap-[5px]">
								<div className="justify-start text-12px font-semibold leading-137% tracking-012px text-neutral-600/80 font-suit">
									{formatPrice(currentPlan.discountPrice || currentPlan.price)} / 년
								</div>
								{currentPlan.discountPrice && currentPlan.discountRate && (
									<div className="justify-start text-hbc-red text-8px font-semibold leading-150% tracking-008px font-suit">
										({currentPlan.discountRate}% 할인)
									</div>
								)}
							</div>
							{currentPlan.discountPrice && (
								<div className="inline-flex items-center justify-center gap-10px">
									<div className="justify-start text-20px font-extrabold leading-140% tracking-02px text-hbc-red font-suit">
										{formatPrice(currentPlan.discountPrice / 12)} / 월
									</div>
								</div>
							)}
						</>
					)}
				</div>
			);
		}

		// 월간 구독 가격 표시
		if (subscriptionPlan === "MONTH") {
			return (
				<div className="inline-flex flex-col items-start justify-start">
					{yearPlan && yearPlan.discountPrice && (
						<div className="justify-start text-12px font-semibold leading-150% tracking-012px text-hbc-red font-suit">
							연간 결제 시 {formatPrice(yearPlan.discountPrice / 12)} / 월
						</div>
					)}
					{monthPlan && (
						<div className="inline-flex justify-center items-center gap-2.5">
							<div className="justify-start text-20px font-extrabold leading-140% tracking-02px text-hbc-black font-suit">
								{formatPrice(monthPlan.price)} / 월
							</div>
						</div>
					)}
				</div>
			);
		}

		return null;
	},
);

SubscribePrice.displayName = "SubscribePrice";
