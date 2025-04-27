"use client";

import { getOrderHistoryQueryOptions } from "./hooks/useOrderHistory";
import { OrderItem } from "./components/OrderItem";
import { cn } from "@/common/utils"; // Assuming cn is available
import type { Order } from "./types"; // Import Order type if needed elsewhere, though OrderItem handles it
import { OrderListHeader } from "./components/OrderListHeader";
import { useQuery } from "@tanstack/react-query";

// TODO: Add proper loading and error states components
// TODO: Style the "no orders" message more appropriately
// TODO: Implement better error handling UI

export const OrderListPage = () => {
	const { data: orders, isLoading, error } = useQuery(getOrderHistoryQueryOptions());

	return (
		// Main container using flex column layout to fill height
		<div className="flex flex-col h-full">
			{/* Header section, fixed at the top */}
			<div className="flex-shrink-0">
				<OrderListHeader />
			</div>

			{/* Scrollable content area that takes remaining space */}
			<div className="flex-grow overflow-y-auto px-35px py-15px">
				{isLoading && (
					// TODO: Replace with a proper skeleton loader or spinner component
					<div className="text-center text-gray-500">Loading orders...</div>
				)}

				{error && (
					// TODO: Implement better error handling UI
					<div className="text-center text-red-500">Error loading orders: {error.message}</div>
				)}

				{!isLoading && !error && (!orders || orders.length === 0) && (
					// TODO: Style the "no orders" message
					<div className="text-center text-gray-500">No purchase history found.</div>
				)}

				{/* Render order items only if loaded successfully and orders exist */}
				{!isLoading && !error && orders && orders.length > 0 && (
					<div className="flex flex-col gap-16px">
						{/* TODO: Add a page title if needed, e.g., <h1 className="mb-4 text-2xl font-bold">Purchase History</h1> */}
						{orders.map((order: Order) => (
							<OrderItem
								key={order.id}
								order={order}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
