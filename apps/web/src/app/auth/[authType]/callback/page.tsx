import { AuthCallbackHandlerPage } from "@/features/auth/components/AuthCallbackHandlerPage";
import { Suspense } from "react";

const CallbackPage = ({ params }: { params: { authType: string } }) => {
	return (
		<Suspense fallback={<></>}>
			<AuthCallbackHandlerPage authType={params.authType} />
		</Suspense>
	);
};

export default CallbackPage;
