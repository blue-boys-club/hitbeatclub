import { AuthCallbackHandlerPage } from "@/features/auth/components/AuthCallbackHandlerPage";
import { Suspense } from "react";

const CallbackPage = () => {
	return (
		<Suspense fallback={<></>}>
			<AuthCallbackHandlerPage />
		</Suspense>
	);
};

export default CallbackPage;
