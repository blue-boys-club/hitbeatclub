import { createZodDto } from "nestjs-zod";
import { CommonResponseIdSchema } from "@hitbeatclub/shared-types/common";

export class ProductResponseDto extends createZodDto(CommonResponseIdSchema) {}
