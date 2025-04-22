import { HBCLoginHeader } from "@/assets/svgs/HBCLoginHeader";
import type { ReactNode } from "react";

interface AuthLayoutProps {
	children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
	return (
		<div className="relative font-['suit']">
			<div className="absolute top-2 left-2">
				<HBCLoginHeader />
			</div>
			{children}
		</div>
	);
};
