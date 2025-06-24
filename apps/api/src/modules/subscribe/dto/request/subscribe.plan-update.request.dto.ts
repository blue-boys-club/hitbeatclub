import { createZodDto } from "nestjs-zod";
import { SubscribePlanUpdateSchema } from "@hitbeatclub/shared-types/subscribe";

export class SubscribePlanUpdateRequestDto extends createZodDto(SubscribePlanUpdateSchema) {}
