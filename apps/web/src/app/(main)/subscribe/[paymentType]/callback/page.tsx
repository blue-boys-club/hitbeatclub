import SubscribeCallbackPage from "@/features/subscribe/components/SubscribeCallbackPage";

const SubscribeCallbackRoute = async ({ params }: { params: Promise<{ paymentType: string }> }) => {
	const { paymentType } = await params;
	return <SubscribeCallbackPage paymentType={paymentType} />;
};

export default SubscribeCallbackRoute;
