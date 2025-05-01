"use client";

import { cn } from "@/common/utils";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Tooltip } from "@/assets/svgs";
type OrderPaymentSummaryProps = {
	subtotal: number;
	serviceFee: number;
	total: number;
};

/**
 * 결제 요약 정보 섹션을 표시하는 컴포넌트입니다.
 */
export const OrderPaymentSummary = ({ subtotal, serviceFee, total }: OrderPaymentSummaryProps) => {
	return (
		<div className={cn("self-stretch flex flex-col justify-start items-start gap-2.5")}>
			<div className={cn("self-stretch text-hbc-black text-16px font-bold font-suit leading-normal")}>결제</div>
			<div className={cn("w-full flex flex-col justify-start items-start gap-1")}>
				<div className={cn("w-full h-auto inline-flex justify-between items-start py-1")}>
					<div className={cn("text-hbc-black text-16px font-semibold font-suisse leading-none")}>Subtotal</div>
					<div className={cn("flex justify-center items-end gap-px")}>
						<span className={cn("text-hbc-black text-16px font-semibold font-suisse leading-none")}>
							{subtotal.toLocaleString()}
						</span>
						<span className={cn("text-hbc-black text-16px font-bold font-suit leading-none")}>원</span>
					</div>
				</div>
				<div className={cn("w-full h-auto inline-flex justify-between items-start py-1")}>
					<div className={cn("flex items-center gap-1")}>
						<div className={cn("text-hbc-black text-16px font-semibold font-suisse leading-none")}>Service Fee</div>
						{/* TODO: Replace with Tooltip component from asset library */}
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
										{/* Replace with actual tooltip content */}
										서비스 이용 수수료 상세 정보 (개발 예정)
										{/* <TooltipPrimitive.Arrow className="fill-hbc-white" /> */}
									</TooltipPrimitive.Content>
								</TooltipPrimitive.Portal>
							</TooltipPrimitive.Root>
						</TooltipPrimitive.Provider>
					</div>
					<div className={cn("flex justify-center items-end gap-px")}>
						<span className={cn("text-hbc-black text-16px font-semibold font-suisse leading-none")}>
							{serviceFee.toLocaleString()}
						</span>
						<span className={cn("text-hbc-black text-16px font-bold font-suit leading-none")}>원</span>
					</div>
				</div>
				<div className={cn("w-full h-auto inline-flex justify-between items-start py-1 font-bold")}>
					<div className={cn("text-hbc-black text-16px font-semibold font-suisse leading-none")}>Total</div>
					<div className={cn("flex justify-center items-end gap-px")}>
						<span className={cn("text-hbc-black text-16px font-semibold font-suisse leading-none")}>
							{total.toLocaleString()}
						</span>
						<span className={cn("text-hbc-black text-16px font-bold font-suit leading-none")}>원</span>
					</div>
				</div>
			</div>
		</div>
	);
};
