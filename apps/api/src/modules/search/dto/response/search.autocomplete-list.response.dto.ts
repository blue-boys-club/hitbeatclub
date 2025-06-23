import { createZodDto } from "nestjs-zod";
import { ProductAutoCompleteResponseSchema } from "@hitbeatclub/shared-types/product";

export class ProductAutoCompleteResponseDto extends createZodDto(ProductAutoCompleteResponseSchema as any) {}
