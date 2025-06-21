import { deepRemoveDefaults } from "@/lib/schema.utils";
import { ProductSearchQuerySchema as UpstreamProductSearchQuerySchema } from "@hitbeatclub/shared-types/product";
import { SearchResultResponseSchema } from "@hitbeatclub/shared-types/search";
import { z } from "zod";

export const ProductSearchQuerySchema = deepRemoveDefaults(UpstreamProductSearchQuerySchema);

export type ProductSearchQuery = z.infer<typeof ProductSearchQuerySchema>;
export type ProductSearchResponse = z.output<typeof SearchResultResponseSchema>;
