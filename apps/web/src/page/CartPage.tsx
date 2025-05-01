import { CartArtistSection } from "../features/cart/components/CartArtistSection";
import { CartHeader } from "../features/cart/components/CartHeader";
import { CartPaymentDetail } from "../features/cart/components/CartPaymentDetail";

const CartPage = () => {
	return (
		<div className="flex flex-col h-full overflow-hidden">
			<div className="flex-shrink-0">
				<CartHeader />
			</div>
			<div className="flex gap-16px py-15px h-[calc(100%-60px)]">
				<div className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto p-1px gap-15px pr-16px">
					<CartArtistSection />
					<CartArtistSection />
					<CartArtistSection />
				</div>
				<div className="sticky rounded-lg h-fit top-20">
					<CartPaymentDetail />
				</div>
			</div>
		</div>
	);
};

export default CartPage;
