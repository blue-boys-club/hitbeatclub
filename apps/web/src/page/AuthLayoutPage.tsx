import { HBCLoginHeader } from "@/assets/svgs/HBCLoginHeader";
import type { ReactNode } from "react";

interface AuthPageProps {
	children: ReactNode;
}

const AuthLayoutPage = ({ children }: AuthPageProps) => {
	return (
		<div className="relative font-['suit']">
			<div className="absolute top-2 left-2">
				<HBCLoginHeader />
			</div>
			{children}
		</div>
	);
};

export default AuthLayoutPage;
