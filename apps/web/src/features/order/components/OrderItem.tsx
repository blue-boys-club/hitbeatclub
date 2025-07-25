"use client";

import { cn } from "@/common/utils";
import * as Collapsible from "@radix-ui/react-collapsible";
import { useState } from "react";
import { OrderProductInfo } from "./OrderProductInfo";
import { OrderPaymentSummary } from "./OrderPaymentSummary";
import { OrderProductItem } from "./OrderProductItem";
import type { PaymentOrderResponse, PaymentOrderItem } from "@hitbeatclub/shared-types/payment";

// --- Type Definitions ---

// Define props based on the PaymentOrderResponse type
type OrderItemProps = {
	order: PaymentOrderResponse;
};

// Simple SVG Arrow Icon for Collapsible Trigger
const ArrowDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 20 20"
		fill="currentColor"
		{...props}
	>
		<path
			fillRule="evenodd"
			d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z"
			clipRule="evenodd"
		/>
	</svg>
);

/**
 * 주문 내역 상세의 개별 항목을 표시하는 컴포넌트입니다. (접기/펴기 가능)
 * PaymentOrderResponse 타입 기반으로 주문 정보를 표시합니다.
 * @param {OrderItemProps} props - 주문 항목 데이터 (PaymentOrderResponse 객체).
 */
export const OrderItem = ({ order }: OrderItemProps) => {
	// Destructure required fields from the order prop
	const { orderNumber, createdAt, items, totalAmount, status } = order;

	const [isOpen, setIsOpen] = useState(false); // State for collapsible

	// Format date and time from createdAt
	const orderDate = new Date(createdAt).toLocaleDateString("ko-KR").replace(/\. /g, "/").replace(".", "");
	const orderTime = new Date(createdAt).toLocaleTimeString("ko-KR", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});

	// TODO: Replace placeholder icons/images with actual ones or SVG components from asset library
	// TODO: Implement actual functionality for buttons (Download, License View)
	// TODO: Refine styling based on final design system tokens/variables if available

	return (
		<Collapsible.Root
			open={isOpen}
			onOpenChange={setIsOpen}
			className={cn(
				"self-stretch p-3.5 rounded-10px shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border-[3px] outline-[3px] outline-offset-[-3px] outline-hbc-black inline-flex flex-col justify-start items-start",
			)}
		>
			{/* Order Header - Acts as trigger */}
			<Collapsible.Trigger asChild>
				<div className={cn("self-stretch inline-flex justify-between items-center cursor-pointer")}>
					{/* Display Order Date/Time from createdAt */}
					<div className={cn("flex justify-start items-center gap-5px")}>
						<div className={cn("text-hbc-gray-400 text-12px font-semibold font-suit leading-none tracking-tight")}>
							주문날짜 :
						</div>
						<div className={cn("text-hbc-gray-400 text-12px font-suisse leading-none tracking-tight")}>{orderDate}</div>
						<div className={cn("text-hbc-gray-400 text-12px font-suisse leading-none tracking-tight")}>{orderTime}</div>
					</div>
					<ArrowDownIcon
						className={cn("w-5 h-5 text-hbc-gray-400 transition-transform duration-200", isOpen && "rotate-180")}
					/>
				</div>
			</Collapsible.Trigger>

			{/* Collapsed View - Fades out when open */}
			<div
				className={cn(
					"flex flex-col w-full gap-16px mt-16px transition-opacity duration-200 ease-in-out", // Base styles and transition
					isOpen && "opacity-0 pointer-events-none h-0 overflow-hidden mt-0", // Hide and fade out when open
					!isOpen && "opacity-100", // Ensure visible when closed
				)}
				aria-hidden={isOpen}
			>
				{/* Map through items for the collapsed summary */}
				{items.map((item: PaymentOrderItem) => (
					<div
						key={`${item.product.id}-summary`} // Ensure unique key for summary view
						className="w-full outline outline-hbc-black rounded-10px px-8px py-12px"
					>
						<OrderProductItem
							className="border-none"
							item={item}
						/>
					</div>
				))}
				{/* Fallback if there are no items */}
				{items.length === 0 && <div className="text-sm text-center text-hbc-gray-400">상품 정보가 없습니다.</div>}
			</div>

			{/* Collapsible Content */}
			<Collapsible.Content
				className={cn(
					"w-full flex flex-col gap-4 data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up mt-16px",
				)}
			>
				{/* Pass data from the order prop to Sub-components */}
				<OrderProductInfo items={items} />
				<OrderPaymentSummary
					total={totalAmount}
					status={status}
					orderNumber={orderNumber}
				/>
			</Collapsible.Content>
		</Collapsible.Root>
	);
};
