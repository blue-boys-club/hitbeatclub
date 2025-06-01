import { ProductListPagingResponse as SharedProductListPagingResponse } from "@hitbeatclub/shared-types/product";

export type ProductListPagingResponse = SharedProductListPagingResponse;
export type ProductListItem = ProductListPagingResponse["data"][number];
