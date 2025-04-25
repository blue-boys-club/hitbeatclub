import Image from "next/image";
import bannerBackground from "@/assets/images/shop-banner-bg.jpeg";

export const ShopBanner = () => {
	return (
		<div className="flex items-center justify-center w-full h-150px">
			<div className="w-[795px] h-150px relative">
				<Image
					src={bannerBackground}
					alt="banner background"
					fill
					className="absolute inset-0 object-cover object-top"
				/>
				<div className="absolute top-9px right-20px font-suisse text-32px font-regular">Music of the Year 2025</div>
			</div>
		</div>
	);
};
