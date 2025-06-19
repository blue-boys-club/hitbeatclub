"use client";

import { memo } from "react";
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SimpleDragOverlay } from "./SimpleDragOverlay";
import { useDragDropHandler } from "../hooks/useDragDropHandler";

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

	const { handleDragStart, handleDragEnd } = useDragDropHandler();

	return (
		<DndContext
			sensors={sensors}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			{children}
			<SimpleDragOverlay />
		</DndContext>
	);
});
