import { OrderListBadge } from "@/assets/svgs";

export const OrderListHeader = () => {
	return (
		<div className="inline-flex flex-col items-start justify-start w-full border-b-6 pl-35px pb-15px gap-5px border-hbc-black">
			<div className="inline-flex items-center justify-center">
				<div className="flex items-center justify-center w-35px h-35px">
					<OrderListBadge />
				</div>
				<div className="justify-start text-hbc-black text-32px font-extrabold font-suisse leading-100% tracking-032px uppercase">
					ORDER LIST
				</div>
			</div>
		</div>
	);
};
