import SubscribeCallbackPage from "@/features/subscribe/components/SubscribeCallbackPage";

const SubscribeCallbackRoute = ({ params }: { params: { paymentType: string } }) => {
	return <SubscribeCallbackPage paymentType={params.paymentType} />;
};

export default SubscribeCallbackRoute;
