import PaymentCompletePage from "@/page/PaymentCompletePage";
import { Suspense } from "react";

export default function PaymentCompleteRoute() {
	return (
		<Suspense fallback={null}>
			<PaymentCompletePage />
		</Suspense>
	);
}
