import { createZodDto } from "nestjs-zod";
import { SubscribePlansResponseSchema } from "@hitbeatclub/shared-types/subscribe";

export class SubscribePlansResponseDto extends createZodDto(SubscribePlansResponseSchema) {}
