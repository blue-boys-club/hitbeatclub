"use client";

import { SubscriptionProvider, useSubscription } from "@/features/subscribe/hooks/useSubscription";
import { AxiosError } from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SubscribeSuccessModal, SubscribeErrorModal } from "@/features/mobile/subscribe/modals";

const SubscribeCallbackInner = ({ paymentMethod }: { paymentMethod: string }) => {
	const search = useSearchParams();
	const router = useRouter();
	const { submitSubscription, openModal } = useSubscription();

	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const result = useMemo(() => {
		const code = search.get("code") || search.get("resultCode") || search.get("imp_success");
		const billingKey = search.get("billingKey") || search.get("billing_key") || search.get("imp_uid");
		const message = search.get("message") || search.get("resultMessage") || search.get("error_msg");
		const transactionType = search.get("transactionType");

		return {
			code,
			billingKey,
			message,
			transactionType,
		};
	}, [search]);

	useEffect(() => {
		const handle = async () => {
			const successCodes = ["0", "true", "success", "1"];

			let isSuccessCondition = false;

			if (paymentMethod.toLowerCase() === "card") {
				isSuccessCondition = !!result.billingKey && (!result.code || successCodes.includes(String(result.code)));
			} else if (paymentMethod.toLowerCase() === "paypal") {
				isSuccessCondition = !result.code || successCodes.includes(String(result.code));
			}

			if (isSuccessCondition) {
				const pending = sessionStorage.getItem("pending-subscribe-form");
				if (pending) {
					try {
						const payload = JSON.parse(pending);
						payload.method = {
							type: paymentMethod.toUpperCase(),
							...(result.billingKey ? { billingKey: result.billingKey } : {}),
						};
						await submitSubscription(payload);
						setIsSuccess(true);
					} catch (e: any) {
						const errMsg = e instanceof AxiosError ? e.response?.data?.message : e?.message || "Unknown error";
						setError(errMsg);
						openModal("error");
					}
				}
			} else if (result.code) {
				setError(result.message || "Payment failed");
				openModal("error");
				// redirect after displaying error for a bit
				setTimeout(() => router.replace("/subscribe"), 3000);
			}
		};
		void handle();
	}, [paymentMethod, submitSubscription, openModal, router, result]);

	return (
		<>
			<div className="flex flex-col items-center justify-center h-screen p-4 text-center">
				{!isSuccess && !error && <h1 className="text-xl font-bold mb-2">Processing subscription...</h1>}
				{error && <h1 className="text-xl font-bold mb-2">Error: {error}</h1>}
				{isSuccess && <h1 className="text-xl font-bold mb-2">Subscription successful</h1>}
				<p>If you are not redirected automatically, please go back to the app.</p>
			</div>
			{/* Mobile modals */}
			<SubscribeSuccessModal />
			<SubscribeErrorModal message={error} />
		</>
	);
};

export default function MobileSubscribeCallbackPage({ paymentMethod }: { paymentMethod: string }) {
	return (
		<SubscriptionProvider>
			<SubscribeCallbackInner paymentMethod={paymentMethod} />
		</SubscriptionProvider>
	);
}
