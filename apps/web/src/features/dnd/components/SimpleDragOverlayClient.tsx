"use client";

import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { DragOverlay, useDndContext } from "@dnd-kit/core";
import { createPortal } from "react-dom";
import { useEffect } from "react";

export const SimpleDragOverlay = () => {
	const { active, over, activeNode } = useDndContext();

	// get is dragging and transform
	// const isDragging = active?.data.current?.type === "PRODUCT";
	const type = active?.data.current?.type;
	const meta = active?.data.current?.meta;
	const overId = over?.id;

	return createPortal(
		<DragOverlay
			modifiers={[snapCenterToCursor]}
			style={{
				width: "250px",
				cursor: !!overId ? "copy" : "grabbing",
				zIndex: 1000,
			}}
		>
			{type === "PRODUCT" && (
				<div className="w-[250px] h-[100px] bg-white rounded-md shadow-md p-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
					<p className="text-sm font-medium">{meta.productName || ""}</p>
					<p className="text-sm text-gray-500">{meta.seller?.stageName || ""}</p>
				</div>
			)}
			{type === "ARTIST" && (
				<div className="w-[250px] h-[100px] bg-white rounded-md shadow-md p-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
					<p className="text-sm font-medium">{meta.stageName || ""}</p>
					{/* <p className="text-sm text-gray-500">{meta.profileImageUrl || ""}</p> */}
				</div>
			)}
		</DragOverlay>,
		document.body,
	);
};
