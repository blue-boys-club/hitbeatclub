import { useDraggable } from "@dnd-kit/core";
import { CSSProperties, memo, useId } from "react";

interface DraggableArtistWrapperProps {
	children: React.ReactNode;
	artistId: number;
	meta: Record<string, unknown>;
}

export const DraggableArtistWrapper = memo(({ children, artistId, meta }: DraggableArtistWrapperProps) => {
	const uniqueId = useId();
	const { attributes, listeners, setNodeRef } = useDraggable({
		id: `artist-${artistId}-${uniqueId}`,
		data: {
			type: "ARTIST",
			artistId,
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

DraggableArtistWrapper.displayName = "DraggableArtistWrapper";
