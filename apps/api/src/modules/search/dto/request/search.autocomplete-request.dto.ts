import { createZodDto } from "nestjs-zod";
import { ProductAutocompleteSearchQuerySchema } from "@hitbeatclub/shared-types/product";

export class ProductAutocompleteSearchQueryRequestDto extends createZodDto(ProductAutocompleteSearchQuerySchema) {}
