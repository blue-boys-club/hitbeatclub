import MobileSubscribeCallbackPage from "@/page/MobileSubscribeCallbackPage";

export default async function SubscribeCallbackRoute({ params }: { params: Promise<{ paymentMethod: string }> }) {
	const { paymentMethod } = await params;
	return <MobileSubscribeCallbackPage paymentMethod={paymentMethod} />;
}
