import MobileSubscribeCallbackPage from "@/page/MobileSubscribeCallbackPage";
import { Suspense } from "react";

export default async function SubscribeCallbackRoute({ params }: { params: Promise<{ paymentMethod: string }> }) {
	const { paymentMethod } = await params;
	return (
		<Suspense fallback={null}>
			<MobileSubscribeCallbackPage paymentMethod={paymentMethod} />
		</Suspense>
	);
}
