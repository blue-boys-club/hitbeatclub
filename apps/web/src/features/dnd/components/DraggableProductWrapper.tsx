import { useDraggable } from "@dnd-kit/core";
import { CSSProperties, memo, useId, type ReactNode } from "react";
import { PlaylistAutoRequest } from "@hitbeatclub/shared-types";

interface DraggableProductWrapperProps {
	children: ReactNode;
	productId: number;
	meta: Record<string, unknown>;
	/** 원본 리스트상의 인덱스 (옵션) */
	index?: number;
	/** 드래그 원본 컨텍스트에 대한 자동 플레이리스트 설정 (옵션) */
	playlistConfig?: PlaylistAutoRequest;
}

export const DraggableProductWrapper = memo(
	({ children, productId, meta, index, playlistConfig }: DraggableProductWrapperProps) => {
		const uniqueId = useId();
		const { attributes, listeners, setNodeRef } = useDraggable({
			id: `product-${productId}-${uniqueId}`,
			data: {
				type: "PRODUCT",
				productId,
				meta,
				index,
				playlistConfig,
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
	},
);

DraggableProductWrapper.displayName = "DraggableProductWrapper";
