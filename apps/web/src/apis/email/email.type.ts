import { deepRemoveDefaults } from "@/lib/schema.utils";
import { EmailSendPayloadSchema as ESP } from "@hitbeatclub/shared-types/email";
import { z } from "zod";

export const EmailSendPayloadSchema = deepRemoveDefaults(ESP);
export type EmailSendPayload = z.infer<typeof EmailSendPayloadSchema>;
