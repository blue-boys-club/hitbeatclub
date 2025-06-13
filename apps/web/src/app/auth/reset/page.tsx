import { AuthResetPassword } from "@/features/auth/components/AuthResetPassword";
import { Toaster } from "@/components/ui/Toast/toaster";
import { Suspense } from "react";

const ResetPage = () => {
	return (
		<Suspense fallback={null}>
			<AuthResetPassword />
		</Suspense>
	);
};

export default ResetPage;
