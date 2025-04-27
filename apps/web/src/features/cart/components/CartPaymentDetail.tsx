"use client";

import { Checkbox, EmptyCheckbox, Tooltip } from "@/assets/svgs";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/common/utils";
import Image from "next/image";
import { useState } from "react";
import { PaymentSelectModal } from "./modal/PaymentSelectModal";
import { PaymentSuccessModal } from "./modal/PaymentSuccessModal";
import { PaymentFailureModal } from "./modal/PaymentFailureModal";

type CartItem = {
	id: number;
	imageUrl: string;
	title: string;
	price: number;
};

type CartPaymentDetailProps = {
	items?: CartItem[];
	subtotal?: number;
	serviceFee?: number;
	total?: number;
};

const defaultItems: CartItem[] = [
	{
		id: 1,
		imageUrl: "https://placehold.co/55x55.png",
		title: "Baby, show you",
		price: 8000,
	},
	{
		id: 2,
		imageUrl: "https://placehold.co/55x55.png",
		title: "Baby, show you",
		price: 8000,
	},
	{
		id: 3,
		imageUrl: "https://placehold.co/55x55.png",
		title: "Baby, show you",
		price: 8000,
	},
];

export const CartPaymentDetail = ({
	items = defaultItems,
	subtotal = 140000,
	serviceFee = 0,
	total = 32000,
}: CartPaymentDetailProps) => {
	const [checkPayment, setCheckPayment] = useState(false);
	const [paymentModalOpen, setPaymentModalOpen] = useState(false);
	const [successModalOpen, setSuccessModalOpen] = useState(false);
	const [failureModalOpen, setFailureModalOpen] = useState(false);
	const [paymentResult, setPaymentResult] = useState<any>(null);
	const [paymentError, setPaymentError] = useState<any>(null);

	const handlePaymentClick = () => {
		if (!items.length) {
			alert("상품을 추가해주세요.");
			return;
		}

		if (!checkPayment) {
			alert("결제 동의 체크박스를 체크해주세요.");
			return;
		}

		setPaymentModalOpen(true);
	};

	const handlePaymentComplete = (result: any) => {
		console.log("Payment completed:", result);

		// 만약 PaymentSelectModal에서 놓친 에러 코드가 있다면 여기서 한 번 더 확인
		if (result && result.code && typeof result.code === "string" && result.code.startsWith("FAILURE")) {
			handlePaymentError({
				message: result.message || "결제가 실패했습니다.",
				code: result.code,
				...result,
			});
			return;
		}

		setPaymentResult({
			amount: total,
			orderId: result.paymentId || crypto.randomUUID(),
			method: result.payMethod || "CARD",
			approvedAt: new Date().toISOString(),
			...result,
		});
		setPaymentModalOpen(false);
		setSuccessModalOpen(true);
		// 여기서 결제 완료 후 처리 로직 구현
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
		return items[0]?.title + (items.length > 1 ? ` 외 ${items.length - 1}개` : "");
	};

	return (
		<div className="flex flex-col items-center gap-10px">
			<div className="flex flex-col items-start gap-23px">
				<div className="flex flex-col items-start self-stretch gap-4">
					<div className="text-2xl font-bold tracking-tight text-black uppercase font-suisse">Checkout</div>
					<div className="flex flex-col items-start self-stretch">
						{items.map((item, index) => (
							<div
								key={item.id}
								className={cn("py-3 inline-flex items-center gap-2.5 w-64 border-t-2 border-black ")}
							>
								<div className={cn("relative w-62px h-62px")}>
									<div
										className={cn(
											"absolute top-0 left-0 border-2 border-hbc-black border-solid",
											"w-62px h-62px",
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
											"@200px/sidebar:w-55px @200px/sidebar:h-55px w-50px h-50px",
											"rounded-6px",
										)}
									/>
								</div>
								<div className="flex flex-col items-start">
									<div className="font-black text-hbc-black leading-24px tracking-016px text-16px font-suisse">
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
										{/* Use a span or div instead of button for non-interactive trigger */}
										<span className="inline-flex items-center justify-center cursor-help">
											<Tooltip /> {/* Assuming Tooltip is the SVG icon component */}
										</span>
									</TooltipPrimitive.Trigger>
									<TooltipPrimitive.Portal>
										<TooltipPrimitive.Content
											sideOffset={5}
											className={cn(
												"z-50 overflow-hidden rounded-md border border-hbc-gray-100 bg-hbc-white px-2 py-1 text-xs text-hbc-black shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
												// Custom styles for the tooltip popover
												"font-suit",
											)}
										>
											{/* Replace "개발 예정" with actual tooltip content */}
											서비스 이용 수수료 상세 정보 (개발 예정)
											{/* <TooltipPrimitive.Arrow className="fill-hbc-white" /> */}
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
			<div className="flex flex-col items-start w-full gap-2">
				<div className="text-[9px] font-semibold font-suit text-hbc-gray-400 self-stretch">
					디지털 음원 구매 후, 다운로드 또는 스트리밍을 시작하지 않은 경우에 <br />
					한해 구매일로부터 7일 이내 환불 요청이 가능합니다.
				</div>
				<button
					className="inline-flex items-center justify-between cursor-pointer gap-10px"
					onClick={() => setCheckPayment(!checkPayment)}
				>
					{checkPayment ? <Checkbox /> : <EmptyCheckbox />}
					<div className="text-[9px] font-semibold font-suit leading-none text-hbc-gray-400">
						결제 관련 이용약관을 확인하였으며, 이에 동의합니다.
					</div>
				</button>
				<PaymentSelectModal
					total={total}
					orderName={getOrderName()}
					orderData={items}
					onPaymentComplete={handlePaymentComplete}
					onPaymentError={handlePaymentError}
					trigger={
						<button className="flex justify-center items-center h-10 bg-black rounded-[5px] outline-1 outline-offset-[-1px] outline-black self-stretch cursor-pointer">
							<div className="font-bold leading-none tracking-tight text-white uppercase text-16px font-suisse">
								결제하러 가기
							</div>
						</button>
					}
				/>
			</div>

			{/* 결제 완료 모달 */}
			<PaymentSuccessModal
				isOpen={successModalOpen}
				onClose={() => setSuccessModalOpen(false)}
				paymentResult={
					paymentResult || {
						amount: total,
						orderId: "SAMPLE-ORDER-ID",
						method: "CARD",
						approvedAt: new Date().toISOString(),
					}
				}
			/>

			{/* 결제 실패 모달 */}
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
