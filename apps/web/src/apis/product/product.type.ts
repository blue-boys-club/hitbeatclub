import { deepRemoveDefaults } from "@/lib/schema.utils";
import { FileSingleProductUploadSchema } from "@hitbeatclub/shared-types/file";
import {
	ProductUpdateSchema as RawProductUpdateSchema,
	ProductCreateSchema as RawProductCreateSchema,
} from "@hitbeatclub/shared-types/product";
import { z } from "zod";

export type PRODUCT_FILE_TYPE = z.infer<typeof FileSingleProductUploadSchema>["type"];

export const ProductUpdateSchema = deepRemoveDefaults(RawProductUpdateSchema);
export const ProductCreateSchema = deepRemoveDefaults(RawProductCreateSchema);

export type ProductUpdate = z.infer<typeof ProductUpdateSchema>;
export type ProductCreate = z.infer<typeof ProductCreateSchema>;
