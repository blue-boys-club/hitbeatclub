// import React, { memo } from "react";
// import { ProductFilters } from "./ProductFilters";
// import { ProductItem } from "./ProductItem";
// import { ProductSort } from "./ProductSort";
// import { ProductSearch } from "./ProductSearch";

// interface ProductListProps {
// 	products: number[]; //Temp
// 	onFiltersChange?: () => void;
// 	onSortChange?: () => void;
// 	onSearch?: (query: string) => void;
// }

// export const ProductList = memo(({ products, onFiltersChange, onSortChange, onSearch }: ProductListProps) => {
// 	return (
// 		<>
// 			<div className="mb-3">
// 				<div className="flex justify-between items-center w-full">
// 					<ProductFilters onFiltersChange={onFiltersChange} />
// 					<ProductSort onSortChange={onSortChange} />
// 				</div>
// 				<ProductSearch onSearch={onSearch} />
// 			</div>

// 			<div className="flex flex-col gap-2.5 mb-3">
// 				{products?.map((product, index) => {
// 					return <ProductItem key={index} />;
// 				})}
// 			</div>
// 		</>
// 	);
// });

// ProductList.displayName = "ProductList";
