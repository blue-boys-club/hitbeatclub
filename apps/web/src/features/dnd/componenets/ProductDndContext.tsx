"use client";

import { memo } from "react";
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SimpleDragOverlay } from "./SimpleDragOverlay";
import { useDragDropHandler } from "../hooks/useDragDropHandler";
import { ProductDetailLicenseModal } from "@/features/product/components/modal/ProductDetailLicenseModal";

export const ProductDndContext = memo(({ children }: { children: React.ReactNode }) => {
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				// delay: 250,
				// tolerance: 10,
				distance: 50,
			},
		}),
	);

	const { handleDragStart, handleDragEnd, isLicenseModalOpen, selectedProductId, handleCloseLicenseModal } =
		useDragDropHandler();

	return (
		<DndContext
			sensors={sensors}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			{children}
			<SimpleDragOverlay />

			{/* 드래그 앤 드롭으로 장바구니에 드롭될 때 열리는 라이센스 모달 */}
			{selectedProductId && (
				<ProductDetailLicenseModal
					productId={selectedProductId}
					isOpen={isLicenseModalOpen}
					onClose={handleCloseLicenseModal}
				/>
			)}
		</DndContext>
	);
});
