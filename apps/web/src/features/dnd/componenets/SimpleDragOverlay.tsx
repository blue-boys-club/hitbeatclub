"use client";

import { DragOverlay, useDndContext } from "@dnd-kit/core";
import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

export const SimpleDragOverlay = () => {
	const { active /*over*/ } = useDndContext();

	// get is dragging and transform
	// const isDragging = active?.data.current?.type === "PRODUCT";
	const meta = active?.data.current?.meta;

	const productName = useMemo(() => {
		if (!meta) return "";
		return meta.productName;
	}, [meta]);
	const sellerStageName = useMemo(() => {
		if (!meta) return "";
		return meta.seller?.stageName;
	}, [meta]);

	if (typeof window === "undefined") return null;

	return createPortal(
		<DragOverlay
			style={{
				width: "250px",
			}}
		>
			<div className="w-[250px] h-[100px] bg-white rounded-md shadow-md p-4 absolute bottom-0 left-0">
				<p className="text-sm font-medium">{productName}</p>
				<p className="text-sm text-gray-500">{sellerStageName}</p>
			</div>
		</DragOverlay>,
		document.body,
	);
};
