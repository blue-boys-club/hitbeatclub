import { createZodDto } from "nestjs-zod";
import { SubscribeRequestSchema } from "@hitbeatclub/shared-types/subscribe";

export class SubscribeRequestDto extends createZodDto(SubscribeRequestSchema) {}
