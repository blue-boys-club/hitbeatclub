import { SubscribeMembershipRequestSchema } from "./../../../../../packages/shared-types/src/subscribe/subscribe.request";
import { z } from "zod";

export const PaypalCredentialSchema = z.object({
	billingKey: z.string().min(1, "페이팔 빌링키를 입력해주세요."),
});

export const SubscribeFormSchema = SubscribeMembershipRequestSchema;

export type SubscribeFormValue = z.infer<typeof SubscribeFormSchema>;
