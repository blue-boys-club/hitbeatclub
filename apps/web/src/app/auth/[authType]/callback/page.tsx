import { AuthCallbackHandlerPage } from "@/features/auth/components/AuthCallbackHandlerPage";
import { Suspense } from "react";

const CallbackPage = async ({ params }: { params: Promise<{ authType: string }> }) => {
	const { authType } = await params;
	return (
		<Suspense fallback={<></>}>
			<AuthCallbackHandlerPage authType={authType} />
		</Suspense>
	);
};

export default CallbackPage;
