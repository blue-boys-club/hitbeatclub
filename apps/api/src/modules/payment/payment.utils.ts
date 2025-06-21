// 포트원 웹훅 데이터 타입 정의
export interface PortOneWebhookBase {
	type: string;
	timestamp: string;
	data: {
		storeId: string;
		[key: string]: any;
	};
}

export interface PortOnePaymentWebhook extends PortOneWebhookBase {
	type:
		| "Transaction.Ready"
		| "Transaction.Paid"
		| "Transaction.VirtualAccountIssued"
		| "Transaction.Failed"
		| "Transaction.PayPending"
		| "Transaction.PartialCancelled"
		| "Transaction.Cancelled"
		| "Transaction.CancelPending"
		| "Transaction.DisputeCreated"
		| "Transaction.DisputeResolved";
	data: {
		storeId: string;
		paymentId: string;
		transactionId: string;
		cancellationId?: string;
	};
}

export interface PortOneBillingKeyWebhook extends PortOneWebhookBase {
	type: "BillingKey.Ready" | "BillingKey.Issued" | "BillingKey.Failed" | "BillingKey.Deleted" | "BillingKey.Updated";
	data: {
		storeId: string;
		billingKey: string;
	};
}

export type PortOneWebhook = PortOnePaymentWebhook | PortOneBillingKeyWebhook;

// 타입 가드 함수들
export function isPaymentWebhook(webhook: PortOneWebhook): webhook is PortOnePaymentWebhook {
	return (
		webhook.type &&
		typeof webhook.type === "string" &&
		webhook.type.startsWith("Transaction.") &&
		webhook.data &&
		"paymentId" in webhook.data
	);
}

export function isBillingKeyWebhook(webhook: PortOneWebhook): webhook is PortOneBillingKeyWebhook {
	return (
		webhook.type &&
		typeof webhook.type === "string" &&
		webhook.type.startsWith("BillingKey.") &&
		webhook.data &&
		"billingKey" in webhook.data
	);
}
