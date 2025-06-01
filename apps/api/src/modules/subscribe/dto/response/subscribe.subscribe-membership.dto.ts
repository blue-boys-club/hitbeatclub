import { createZodDto } from "nestjs-zod";
import { SubscribeMembershipResponseSchema } from "@hitbeatclub/shared-types/subscribe";

export class SubscribeMembershipResponseDto extends createZodDto(SubscribeMembershipResponseSchema) {}
