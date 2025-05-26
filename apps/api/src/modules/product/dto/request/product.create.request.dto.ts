import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { ProductCreateSchema } from "@hitbeatclub/shared-types/product";

export class ProductCreateDto extends createZodDto(ProductCreateSchema) {}
