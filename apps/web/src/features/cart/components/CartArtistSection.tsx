"use client";

import { Acapella, Beat, CloseMosaic, SmallAuthBadge } from "@/assets/svgs";
import UI from "@/components/ui";
import Image from "next/image";
import { useState } from "react";
import { LicenseChangeModal } from "./modal/LicenseChangeModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/stores/cart";
import { PRODUCTS_MAP } from "@/apis/product/product.dummy";

// Combined type for cart item with product details
export type CartItemWithProductDetails = {
	id: number; // product id
	imageUrl: string;
	title: string;
	licenseType: "MASTER" | "EXCLUSIVE";
	licenseName: string;
	licenseDescription: string;
	type: "acapella" | "beat";
	price: number;
	// Add other product details if needed
};

// Type for the artist section props
interface CartArtistSectionProps {
	artistId: number;
	artistImageUrl: string;
	artistName: string;
	items: CartItemWithProductDetails[];
}

export const CartArtistSection = ({ artistId, artistImageUrl, artistName, items }: CartArtistSectionProps) => {
	const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState<CartItemWithProductDetails | null>(null);
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const storeRemoveItem = useCartStore((state) => state.removeItem);
	const storeAddItem = useCartStore((state) => state.addItem); // addItem handles updates too

	// 라이센스 변경 mutation (simulated)
	const changeLicenseMutation = useMutation({
		mutationFn: async ({
			productId,
			newLicenseType,
		}: {
			productId: number;
			newLicenseType: "MASTER" | "EXCLUSIVE";
		}) => {
			// Simulate API call
			return new Promise<void>((resolve) => {
				setTimeout(() => {
					console.log(`라이센스 변경 시도: productId=${productId}, newLicenseType=${newLicenseType}`);
					// Update cart store
					storeAddItem({ id: productId, licenseType: newLicenseType });
					resolve();
				}, 500);
			});
		},
		onSuccess: () => {
			console.log("라이센스 변경 성공 (Store 업데이트)");
			toast({
				description: "라이센스 옵션이 변경 되었습니다.",
			});
			// Optionally, invalidate queries that depend on cart state if any
			// queryClient.invalidateQueries({ queryKey: ["cartData"] });
		},
		onError: (error) => {
			console.error("라이센스 변경 실패:", error);
			toast({
				description: "라이센스 변경 중 오류가 발생했습니다.",
				variant: "destructive",
			});
		},
	});

	const handleOpenLicenseModal = (item: CartItemWithProductDetails) => {
		setSelectedItem(item);
		setIsLicenseModalOpen(true);
	};

	const handleCloseLicenseModal = () => {
		setIsLicenseModalOpen(false);
		setSelectedItem(null);
	};

	const handleChangeLicense = (productId: number, newLicenseType: "MASTER" | "EXCLUSIVE") => {
		changeLicenseMutation.mutate({ productId, newLicenseType });
		handleCloseLicenseModal();
	};

	const handleRemoveItem = (productId: number) => {
		storeRemoveItem(productId);
		toast({
			description: "장바구니에서 삭제 되었습니다.",
		});
	};

	if (!items?.length) {
		return null; // Don't render section if no items for this artist
	}

	return (
		<>
			<div className="flex flex-col items-start gap-8px self-stretch rounded-[10px] p-3 outline-1 outline-hbc-black">
				<div className="flex items-center self-stretch justify-between">
					<div className="flex items-center gap-17px">
						<Image
							className="h-51px w-51px rounded-full outline-2 outline-offset-[-1px] outline-black"
							src={artistImageUrl} // Use prop
							alt={artistName} // Use prop
							width={51 * 4}
							height={51 * 4}
						/>
						<div className="flex items-center gap-5px">
							<div className="text-base font-bold text-black font-suisse">
								<span>{artistName}</span> {/* Use prop */}
							</div>
							<SmallAuthBadge />
						</div>
					</div>
					<div className="font-medium leading-none text-black text-12px tracking-012px font-suisse">
						{items.length} Tracks {/* Use prop */}
					</div>
				</div>
				{items.map((item) => (
					<div
						key={item.id} // Product ID
						className="flex flex-col items-start gap-2.5 self-stretch border-t border-dashed border-hbc-black bg-hbc-white py-3"
					>
						<div className="flex items-center self-stretch justify-between h-80px">
							<div className="flex items-center justify-start gap-13px">
								<Image
									className="h-80px w-80px rounded-[5px] border-black"
									src={item.imageUrl}
									alt={item.title}
									width={79 * 4}
									height={79 * 4}
								/>
								<div className="flex flex-col items-start justify-between h-20 py-1">
									<div className="flex items-center justify-start overflow-hidden">
										<div className="h-6 text-20px font-bold leading-120% tracking-02px text-black truncate font-suit w-80">
											{item.title}
										</div>
										{item.type === "acapella" && <Acapella />}
										{item.type === "beat" && <Beat />}
									</div>
									<div className="flex h-4 w-auto items-center justify-start gap-2.5 py-[5px]">
										{/* Display license name and description */}
										<div className="font-medium leading-16px text-12px tracking-012px font-suisse text-hbc-gray-400">
											{item.licenseName} ({item.licenseDescription})
										</div>
									</div>
									<div className="flex items-center justify-center gap-2.5 overflow-hidden rounded-[5px]">
										<button
											className="text-12px font-bold leading-16px tracking-012px text-[#001EFF] font-suit cursor-pointer"
											onClick={() => handleOpenLicenseModal(item)}
											disabled={changeLicenseMutation.isPending && selectedItem?.id === item.id}
										>
											{changeLicenseMutation.isPending && selectedItem?.id === item.id ? "변경 중..." : "라이센스 변경"}
										</button>
									</div>
								</div>
							</div>
							<div className="relative flex flex-col items-end justify-center h-20 gap-3 py-1 w-28">
								<div className="absolute left-[32px] top-0 flex items-center justify-start">
									<UI.BodySmall>{item.price.toLocaleString()}</UI.BodySmall>
									<UI.BodySmall>원</UI.BodySmall>
								</div>

								<button
									className="w-5 h-5 cursor-pointer"
									onClick={() => {
										handleRemoveItem(item.id); // Pass product ID
									}}
								>
									<CloseMosaic />
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			{selectedItem && (
				<LicenseChangeModal
					isOpen={isLicenseModalOpen}
					onClose={handleCloseLicenseModal}
					currentLicenseType={selectedItem.licenseType} // Pass licenseType
					currentItemId={selectedItem.id} // Pass product ID
					onChangeLicense={handleChangeLicense} // Expects (productId, newLicenseType)
				/>
			)}
		</>
	);
};
