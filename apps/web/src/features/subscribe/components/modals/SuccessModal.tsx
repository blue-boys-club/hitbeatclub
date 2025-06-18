import { memo, useMemo } from "react";
import Link from "next/link";
import { Popup, PopupContent, PopupDescription, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import { useSubscription } from "../../hooks/useSubscription";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";

/**
 * 멤버십 가입 성공 모달 컴포넌트
 */
export const SuccessModal = memo(() => {
	const { modals, closeModal } = useSubscription();

	const { data: user } = useQuery(getUserMeQueryOption());

	const handleOnOpenChange = (open: boolean) => {
		if (!open) {
			closeModal("success");
		}
	};

	const formatDate = (dateString: Date) => {
		const date = new Date(dateString);
		date.setHours(date.getHours() + 9);

		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}.${month}.${day}`;
	};

	const subscriptionInfo = useMemo(() => {
		if (!user) {
			return null;
		}

		const { id, subscribe } = user;

		return {
			userId: id,
			createdAt: new Date(subscribe?.createdAt || "").toLocaleDateString("ko-KR"),
			nextPaymentDate: subscribe?.nextPaymentDate ? formatDate(subscribe?.nextPaymentDate) : null,
			subscriptionPlan: subscribe?.subscriptionPlan,
			price: subscribe?.price,
			couponId: (subscribe as any)?.couponId,
		};
	}, [user]);

	return (
		<Popup
			open={modals.success}
			onOpenChange={handleOnOpenChange}
		>
			<PopupContent className="w-[589px] max-w-[589px] flex flex-col justify-start items-center gap-25px">
				<PopupHeader>
					<PopupTitle className="text-26px font-extrabold">히트비트클럽 멤버가 되신 걸 환영합니다!</PopupTitle>
					<PopupDescription className="sr-only">히트비트클럽 멤버가 되신 걸 환영합니다!</PopupDescription>
				</PopupHeader>

				<div className="flex flex-col items-center justify-center w-full gap-25px">
					<div className="flex flex-col items-start justify-start h-16 gap-10px">
						<div className="flex flex-col items-start justify-start gap-20px">
							<div className="self-stretch font-bold leading-loose text-center tracking-016px text-16px text-hbc-black font-suit">
								ROAD TO THE HITMAKER <br />
								지금부터 당신의 사운드는 진짜 무기가 됩니다.
							</div>
						</div>
					</div>

					<div className="flex flex-col items-start justify-start gap-5 w-415px">
						<div className="self-stretch font-bold leading-loose tracking-016px text-16px text-hbc-black font-suit">
							<div>📦 멤버십 정보</div>
							<div className="flex">
								<div className="w-[100px]">이용 플랜</div>
								<div>
									히트비트멤버십 <span>({subscriptionInfo?.subscriptionPlan === "MONTH" ? "월간" : "연간"})</span>
								</div>
							</div>
							<div className="flex">
								<div className="w-[100px]">결제 금액</div>
								{subscriptionInfo?.subscriptionPlan === "MONTH" && (
									<div>₩{subscriptionInfo?.price?.toLocaleString()}</div>
								)}
								{subscriptionInfo?.subscriptionPlan === "YEAR" && (
									<div>
										₩{((subscriptionInfo?.price ?? 0) / 12).toLocaleString()} / ₩
										{subscriptionInfo?.price?.toLocaleString()}
									</div>
								)}
							</div>
							<div className="flex">
								<div className="w-[100px]">다음 결제일</div>
								<div>{subscriptionInfo?.nextPaymentDate}</div>
							</div>
						</div>
					</div>

					{subscriptionInfo?.couponId && (
						<div className="flex flex-col items-start justify-start gap-5 w-415px">
							<div className="self-stretch">
								<span className="font-bold leading-loose tracking-016px text-16px text-hbc-black font-suit">
									🎁 적용된 혜택
									<br />
								</span>
								<span className="font-bold leading-loose tracking-016px text-16px text-hbc-black font-suit">
									✅ HITCODE 3개월 무료 혜택 적용
									<br />✅ 수수료 할인 혜택 활성화
								</span>
							</div>
						</div>
					)}
				</div>
				<PopupFooter>
					<Link
						href={`/artist-studio/${subscriptionInfo?.userId}`}
						className="px-2.5 py-[5px] bg-red-600 rounded-[20px] inline-flex justify-center items-center gap-2.5"
						onClick={() => {
							closeModal("success");
						}}
					>
						<div className="font-bold leading-none text-center text-18px tracking-018px text-hbc-white font-suit">
							아티스트 스튜디오로 이동
						</div>
					</Link>
				</PopupFooter>
			</PopupContent>
		</Popup>
	);
});

SuccessModal.displayName = "SuccessModal";
