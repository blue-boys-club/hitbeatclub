import React, { memo } from "react";
import { ProductItem } from "../../../product/components/ProductItem";
import { MobileProductItem } from "./MobileProductItem";

export const MobileProductList = memo(() => {
	return (
		<div className="flex flex-col gap-2.5 mb-3">
			{Array.from({ length: 10 }).map((_, idx) => {
				return <MobileProductItem key={idx} />;
			})}
		</div>
	);
});

MobileProductList.displayName = "MobileProductList";
