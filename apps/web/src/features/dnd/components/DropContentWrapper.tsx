import { useDroppable } from "@dnd-kit/core";
import { Slot } from "@radix-ui/react-slot";

interface DropContentWrapperProps {
	id: string;
	children: React.ReactNode;
	asChild?: boolean;
}

export const DropContentWrapper = ({ id, children, asChild = false }: DropContentWrapperProps) => {
	const { setNodeRef } = useDroppable({ id });

	const Comp = asChild ? Slot : "div";

	return <Comp ref={setNodeRef}>{children}</Comp>;
};
