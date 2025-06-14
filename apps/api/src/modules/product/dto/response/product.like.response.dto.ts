import { createZodDto } from "nestjs-zod";
import { ProductRowByDashboardSchema } from "@hitbeatclub/shared-types/product";

export class ProductLikeResponseDto extends createZodDto(ProductRowByDashboardSchema) {}
