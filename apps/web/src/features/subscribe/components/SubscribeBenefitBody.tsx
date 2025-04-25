import UI from "@/components/ui";
import { memo, useMemo } from "react";

export const SubscribeBenefits = memo(() => {
	const benefits = [
		"0% 판매자 서비스 이용 수수료 (카드 수수료 및 세금 별도)",
		"무제한 상품등록 가능",
		"Free 다운로드 사용 가능",
		"Exclusive 라이센스 판매 가능",
		"Master 라이센스 판매 가능",
		"이벤트 참여 기회 제공",
		"히트비트클럽이 주관하는 프로모션 우선 참여권 제공",
		"비공개 업로드 기능 제공",
	];

	return (
		<div className="py-2.5 border-black inline-flex flex-col justify-center items-start">
			{benefits.map((benefit) => (
				<div
					key={benefit}
					className="justify-start font-semibold leading-normal text-black text-15px font-suit"
				>
					{benefit}
				</div>
			))}
		</div>
	);
});

SubscribeBenefits.displayName = "SubscribeBenefits";

export const SubscribeBenefitBody = memo(({ isSubscribed }: { isSubscribed: boolean }) => {
	const title = useMemo(() => {
		if (!isSubscribed) {
			return "요금제를 구독하시면 다음과 같은 혜택을 누리실 수 있습니다.";
		}

		return "🎉 현재 히트비트 멤버십을 이용 중입니다!\n무제한 업로드와 정산 혜택을 마음껏 누려보세요.";
	}, [isSubscribed]);

	return (
		<div className="inline-flex flex-col items-start justify-start gap-2">
			<UI.Heading6 className="whitespace-pre-line">{title}</UI.Heading6>
			<SubscribeBenefits />
		</div>
	);
});

SubscribeBenefitBody.displayName = "SubscribeBenefitBody";
