import { z } from "zod";

export const SubscribeMembershipResponseSchema = z.object({
	userId: z.number(),
	subscribedAt: z.date(),
	artistId: z.number(),
});

export type SubscribeMembershipResponse = z.infer<typeof SubscribeMembershipResponseSchema>;
