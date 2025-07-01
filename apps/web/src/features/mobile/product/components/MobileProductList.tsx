import React, { memo } from "react";
import { MobileProductItem } from "./MobileProductItem";
import { ProductSearchResponse } from "@/apis/search/search.type";

export const MobileProductList = memo(
	({
		products,
		artists,
	}: {
		products: ProductSearchResponse["products"];
		artists: ProductSearchResponse["artists"];
	}) => {
		return (
			<div className="flex flex-col gap-2.5 mb-3">
				{products.map((product) => {
					return (
						<MobileProductItem
							key={product.id}
							type="search"
							product={product}
						/>
					);
				})}
			</div>
		);
	},
);

MobileProductList.displayName = "MobileProductList";
