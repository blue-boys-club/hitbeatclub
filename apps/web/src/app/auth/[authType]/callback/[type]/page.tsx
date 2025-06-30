import { AuthCallbackHandlerPage } from "@/features/auth/components/AuthCallbackHandlerPage";
import { Suspense } from "react";

const CallbackPage = async ({ params }: { params: Promise<{ authType: string; type: string }> }) => {
	const { authType, type } = await params;
	return (
		<Suspense fallback={<></>}>
			<AuthCallbackHandlerPage authType={authType} type={type} />
		</Suspense>
	);
};

export default CallbackPage;