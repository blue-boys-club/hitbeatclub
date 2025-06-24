import { SubscribeRequestSchema } from "@hitbeatclub/shared-types/subscribe";
import { z } from "zod";

export const SubscribeFormSchema = SubscribeRequestSchema;

export type SubscribeFormValue = z.input<typeof SubscribeFormSchema>;
