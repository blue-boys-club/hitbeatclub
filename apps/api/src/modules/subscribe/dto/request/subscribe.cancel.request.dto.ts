import { createZodDto } from "nestjs-zod";
import { SubscribeCancelSchema } from "@hitbeatclub/shared-types/subscribe";

export class SubscribeCancelRequestDto extends createZodDto(SubscribeCancelSchema) {}
