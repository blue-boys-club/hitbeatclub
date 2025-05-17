import ProductDetailPage from "@/page/ProductDetailPage";

const ProductPage = async ({ params }: { params: Promise<{ productId: string }> }) => {
	const { productId } = await params;

	return <ProductDetailPage trackId={Number(productId)} />;
};

export default ProductPage;
