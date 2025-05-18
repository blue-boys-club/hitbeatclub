import { memo } from "react";

interface SubscribeCallbackPageProps {
	paymentType: string;
}

const SubscribeCallbackPage = ({ paymentType }: SubscribeCallbackPageProps) => {
	return (
		<div>
			<h1>Subscribe Callback Page</h1>
			<p>Payment Type: {paymentType}</p>
		</div>
	);
};

export default memo(SubscribeCallbackPage);
