import { useDraggable } from "@dnd-kit/core";
import { CSSProperties, memo, useId } from "react";

interface DraggableProductWrapperProps {
	children: React.ReactNode;
	productId: number;
	meta: Record<string, unknown>;
}

export const DraggableProductWrapper = memo(({ children, productId, meta }: DraggableProductWrapperProps) => {
	const uniqueId = useId();
	const { attributes, listeners, setNodeRef } = useDraggable({
		id: `product-${productId}-${uniqueId}`,
		data: {
			type: "PRODUCT",
			productId,
			meta,
		},
	});

	return (
		<div
			ref={setNodeRef}
			{...listeners}
			{...attributes}
		>
			{children}
		</div>
	);
});

DraggableProductWrapper.displayName = "DraggableProductWrapper";
