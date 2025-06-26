"use client";

import { Checkbox, EmptyCheckbox, Tooltip } from "@/assets/svgs";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/common/utils";
import Image from "next/image";
import { useState } from "react";
import { PaymentSelectModal } from "./modal/PaymentSelectModal";
import { PaymentSuccessModal } from "./modal/PaymentSuccessModal";
import { PaymentFailureModal } from "./modal/PaymentFailureModal";
import Link from "next/link";
import { createPaymentOrder } from "@/apis/payment/payment.api";
import type { PaymentOrderResponse } from "@hitbeatclub/shared-types/payment";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getUserMeQueryOption } from "@/apis/user/query/user.query-option";

export type CheckoutItem = {
	id: number; // cart item ID (not product ID)
	imageUrl: string;
	title: string;
	price: number;
};

interface CartPaymentDetailProps {
	checkoutItems: CheckoutItem[];
	subtotal: number;
	serviceFee: number;
	total: number;
}

export const CartPaymentDetail = ({ checkoutItems, subtotal, serviceFee = 0, total }: CartPaymentDetailProps) => {
	const [checkPayment, setCheckPayment] = useState(false);
	const [paymentModalOpen, setPaymentModalOpen] = useState(false);
	const [successModalOpen, setSuccessModalOpen] = useState(false);
	const [failureModalOpen, setFailureModalOpen] = useState(false);
	const [paymentResult, setPaymentResult] = useState<PaymentOrderResponse | null>(null);
	const [paymentError, setPaymentError] = useState<{ message: string; code: string } | null>(null);
	const [isCreatingOrder, setIsCreatingOrder] = useState(false);
	const router = useRouter();
	const { data: user } = useQuery(getUserMeQueryOption());

	const handlePaymentClick = () => {
		if (!checkoutItems.length) {
			alert("상품을 추가해주세요.");
			return;
		}

		if (!user) {
			router.push("/auth/login?redirect=/carts");
			return;
		}

		if (!checkPayment) {
			alert("결제 동의 체크박스를 체크해주세요.");
			return;
		}

		setPaymentModalOpen(true);
	};

	const handlePaymentComplete = (result: PaymentOrderResponse) => {
		console.log("Payment completed:", result);

		setPaymentResult(result);
		setPaymentModalOpen(false);
		setSuccessModalOpen(true);
	};

	const handlePaymentError = (error: any) => {
		console.error("Payment error:", error);
		setPaymentError({
			message: error?.message || "결제 중 오류가 발생했습니다.",
			code: error?.code || "ERROR",
			...error,
		});
		setPaymentModalOpen(false);
		setFailureModalOpen(true);
	};

	const getOrderName = () => {
		if (!checkoutItems || checkoutItems.length === 0) return "";
		return checkoutItems[0]?.title + (checkoutItems.length > 1 ? ` 외 ${checkoutItems.length - 1}개` : "");
	};

	return (
		<div className="flex flex-col items-center gap-10px min-w-259px">
			<div className="flex flex-col items-start gap-23px w-full">
				<div className="flex flex-col items-start self-stretch gap-4">
					<div className="text-2xl font-bold tracking-tight text-black uppercase font-suisse">Checkout</div>
					<div className="flex flex-col items-start self-stretch">
						{checkoutItems.map((item, index) => (
							<div
								key={item.id}
								className={cn("py-3 inline-flex items-center gap-2.5 w-259px border-t-2 border-black ")}
							>
								<div className={cn("relative w-66px h-66px")}>
									<div
										className={cn(
											"absolute top-0 left-0 border-2 border-hbc-black border-solid",
											"w-66px h-66px",
											"rounded-12px",
										)}
										aria-hidden="true"
									/>
									<Image
										src={item.imageUrl}
										alt={item.title}
										width={240}
										height={240}
										className={cn(
											"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
											"w-55px h-55px object-cover",
											"rounded-6px",
										)}
									/>
								</div>
								<div className="flex flex-col items-start">
									<div className="font-black text-hbc-black leading-24px tracking-016px text-16px font-suisse truncate w-180px">
										{item.title}
									</div>
									<div className="font-bold text-hbc-black text-14px leading-24px tracking-014px font-suisse">
										{item.price.toLocaleString()}₩
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="flex flex-col items-start self-stretch gap-10px">
					<div className="inline-flex items-start justify-between w-full h-5">
						<div className="font-semibold leading-none text-16px font-suisse text-hbc-gray-400">Subtotal</div>
						<div>
							<span className="font-semibold leading-none text-16px font-suisse text-hbc-gray-400">
								{subtotal.toLocaleString()}
							</span>
							<span className="font-bold leading-none text-16px font-suit text-hbc-gray-400">원</span>
						</div>
					</div>
					<div className="flex items-start justify-between w-full h-4">
						<div className="flex items-start gap-2px">
							<div className="font-semibold leading-none text-16px font-suisse text-hbc-gray-400">Service Fee</div>
							<TooltipPrimitive.Provider>
								<TooltipPrimitive.Root delayDuration={100}>
									<TooltipPrimitive.Trigger asChild>
										<span className="inline-flex items-center justify-center cursor-help">
											<Tooltip />
										</span>
									</TooltipPrimitive.Trigger>
									<TooltipPrimitive.Portal>
										<TooltipPrimitive.Content
											sideOffset={5}
											className={cn(
												"z-50 overflow-hidden rounded-md border border-hbc-gray-100 bg-hbc-white px-2 py-1 text-xs text-hbc-black shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
												"font-suit",
											)}
										>
											서비스 이용 수수료 상세 정보 (개발 예정)
										</TooltipPrimitive.Content>
									</TooltipPrimitive.Portal>
								</TooltipPrimitive.Root>
							</TooltipPrimitive.Provider>
						</div>
						<div>
							<span className="font-semibold leading-none text-16px font-suisse text-hbc-gray-400">
								{serviceFee.toLocaleString()}
							</span>
							<span className="font-bold leading-none text-16px font-suit text-hbc-gray-400">원</span>
						</div>
					</div>
				</div>

				<div className="inline-flex justify-between items-center w-full h-55px py-12px border-t-2 border-b-[6px] border-black overflow-hidden">
					<div className="font-bold uppercase text-24px tracking-024px text-hbc-black font-suisse">total</div>
					<div>
						<span className="font-bold uppercase text-24px tracking-024px text-hbc-black font-suisse">
							{total.toLocaleString()}
						</span>
						<span className="font-black uppercase text-24px tracking-024px text-hbc-black font-suisse">₩</span>
					</div>
				</div>
			</div>
			<div className="flex flex-col items-start gap-2 w-259px">
				<div className="text-[9px] font-semibold font-suit text-hbc-gray-400 self-stretch">
					구매시 주문목록 페이지를 통해 다운로드하여 바로 사용할 수 있으며,
					<br />
					구매 후 1년간 다운로드가 가능합니다.
					<br />
					음원 구매 후, 다운로드 또는 스트리밍을 시작하지 않은 경우에 <br />
					한해 구매일로부터 7일 이내 환불 요청이 가능합니다.
					<br />
				</div>
				<div className="inline-flex items-start gap-[10px] self-stretch">
					<button
						type="button"
						onClick={() => setCheckPayment(!checkPayment)}
						className="flex-shrink-0 cursor-pointer"
					>
						{checkPayment ? <Checkbox /> : <EmptyCheckbox />}
					</button>
					<div className="text-[9px] font-semibold font-suit leading-10px text-hbc-gray-400">
						<Link
							href={"/refund-policy"}
							className="text-hbc-blue cursor-pointer"
						>
							[환불 및 취소정책]
						</Link>
						{" 및 "}
						<Link
							href={"/terms-of-service"}
							className="text-hbc-blue cursor-pointer" // Corrected "cursor-" to "cursor-pointer"
						>
							[서비스이용약관]
						</Link>{" "}
						을 확인하였으며,
						<br />
						이에 동의합니다.
					</div>
				</div>
				<PaymentSelectModal
					total={total}
					orderName={getOrderName()}
					checkoutItems={checkoutItems}
					onPaymentComplete={handlePaymentComplete}
					onPaymentError={handlePaymentError}
					trigger={
						<button
							onClick={handlePaymentClick}
							disabled={!checkoutItems.length || isCreatingOrder}
							className="flex justify-center items-center h-10 bg-black rounded-[5px] outline-1 outline-offset-[-1px] outline-black self-stretch cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<div className="font-bold leading-none tracking-tight text-white uppercase text-16px font-suisse">
								{isCreatingOrder ? "주문 생성 중..." : !user ? "로그인하기" : "결제하러 가기"}
							</div>
						</button>
					}
				/>
			</div>

			{paymentResult && (
				<PaymentSuccessModal
					isOpen={successModalOpen}
					onClose={() => setSuccessModalOpen(false)}
					paymentResult={paymentResult || null}
				/>
			)}

			<PaymentFailureModal
				isOpen={failureModalOpen}
				onClose={() => setFailureModalOpen(false)}
				error={
					paymentError || {
						message: "결제 처리 중 오류가 발생했습니다.",
						code: "PAYMENT_ERROR",
					}
				}
			/>
		</div>
	);
};
