import { createZodDto } from "nestjs-zod";
import { ProductListDashboardResponseSchema } from "@hitbeatclub/shared-types/product";

export class ProductListDashboardResponse extends createZodDto(ProductListDashboardResponseSchema) {}
