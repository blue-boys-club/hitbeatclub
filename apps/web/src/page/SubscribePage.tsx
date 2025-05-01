import { Footer } from "@/components/layout/Footer";
import { SubscribeBanner } from "../features/subscribe/components/SubscribeBanner";
import { SubscribeForm } from "../features/subscribe/components/SubscribeForm";
import { SubscribeHeader } from "../features/subscribe/components/SubscribeHeader";

const SubscribePage = () => {
	return (
		<div className="flex flex-col">
			<SubscribeHeader />
			<SubscribeBanner />
			<SubscribeForm />
			<Footer />
		</div>
	);
};

export default SubscribePage;
