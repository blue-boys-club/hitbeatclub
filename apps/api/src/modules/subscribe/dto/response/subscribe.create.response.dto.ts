import { createZodDto } from "nestjs-zod";
import { SubscribeCreateResponseSchema } from "@hitbeatclub/shared-types/subscribe";

export class SubscribeCreateResponseDto extends createZodDto(SubscribeCreateResponseSchema) {}
