import { createZodDto } from "nestjs-zod";
import { ProductLikeResponseSchema } from "@hitbeatclub/shared-types";

export class ProductLikeResponseDto extends createZodDto(ProductLikeResponseSchema) {}
