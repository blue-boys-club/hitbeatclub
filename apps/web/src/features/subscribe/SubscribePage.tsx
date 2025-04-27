import Footer from "../shop/components/Footer";
import { SubscribeBanner } from "./components/SubscribeBanner";
import { SubscribeForm } from "./components/SubscribeForm";
import { SubscribeHeader } from "./components/SubscribeHeader";

export const SubscribePage = () => {
	return (
		<div className="flex flex-col">
			<SubscribeHeader />
			<SubscribeBanner />
			<SubscribeForm />
			<Footer />
		</div>
	);
};
