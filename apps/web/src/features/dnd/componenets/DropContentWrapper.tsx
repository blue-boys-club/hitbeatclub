import { useDroppable } from "@dnd-kit/core";

interface DropContentWrapperProps {
	id: string;
	children: React.ReactNode;
}

export const DropContentWrapper = ({ id, children }: DropContentWrapperProps) => {
	const { setNodeRef } = useDroppable({ id });

	return <div ref={setNodeRef}>{children}</div>;
};
