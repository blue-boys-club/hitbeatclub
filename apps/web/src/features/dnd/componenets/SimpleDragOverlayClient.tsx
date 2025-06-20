"use client";

import { DragOverlay, useDndContext } from "@dnd-kit/core";
import { createPortal } from "react-dom";

export const SimpleDragOverlay = () => {
	const { active /*over*/ } = useDndContext();

	// get is dragging and transform
	// const isDragging = active?.data.current?.type === "PRODUCT";
	const type = active?.data.current?.type;
	const meta = active?.data.current?.meta;

	return createPortal(
		<DragOverlay
			style={{
				width: "250px",
			}}
		>
			{type === "PRODUCT" && (
				<div className="w-[250px] h-[100px] bg-white rounded-md shadow-md p-4 absolute bottom-0 left-0">
					<p className="text-sm font-medium">{meta.productName || ""}</p>
					<p className="text-sm text-gray-500">{meta.seller?.stageName || ""}</p>
				</div>
			)}
			{type === "ARTIST" && (
				<div className="w-[250px] h-[100px] bg-white rounded-md shadow-md p-4 absolute bottom-0 left-0">
					<p className="text-sm font-medium">{meta.stageName || ""}</p>
					{/* <p className="text-sm text-gray-500">{meta.profileImageUrl || ""}</p> */}
				</div>
			)}
		</DragOverlay>,
		document.body,
	);
};
