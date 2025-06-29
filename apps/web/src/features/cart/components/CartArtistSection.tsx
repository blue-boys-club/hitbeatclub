"use client";

import { Acapella, Beat, CloseMosaic, SmallAuthBadge, PauseCircle, PlayCircle } from "@/assets/svgs";
import UI from "@/components/ui";
import Image from "next/image";
import { useMemo, useState } from "react";
import { LicenseChangeModal } from "./modal/LicenseChangeModal";
import UserProfileImage from "@/assets/images/user-profile.png";
import Link from "next/link";
import { usePlaylist } from "@/hooks/use-playlist";
import { usePlayTrack } from "@/hooks/use-play-track";
import { useAudioStore } from "@/stores/audio";
import { useShallow } from "zustand/react/shallow";
import { PlaylistManualRequest } from "@hitbeatclub/shared-types";

// Combined type for cart item with product details
export type CartItemWithProductDetails = {
	cartId: number; // cart item id for deletion/update
	productId: number; // product id
	imageUrl: string;
	title: string;
	licenseType: "MASTER" | "EXCLUSIVE";
	licenseName: string;
	licenseDescription: string;
	type: "acapella" | "beat";
	price: number;
	selectedLicenseId: number; // current selected license id
	availableLicenses: Array<{
		id: number;
		type: "MASTER" | "EXCLUSIVE";
		price: number;
	}>;
};

// Type for the artist section props
interface CartArtistSectionProps {
	artistSlug: string;
	artistImageUrl?: string;
	artistName: string;
	items: CartItemWithProductDetails[];
	onDeleteItem: (cartId: number) => void;
	onUpdateItemLicense: (cartId: number, licenseId: number) => void;
	trackIds: number[];
}

export const CartArtistSection = ({
	artistSlug,
	artistImageUrl,
	artistName,
	items,
	onDeleteItem,
	onUpdateItemLicense,
	trackIds,
}: CartArtistSectionProps) => {
	const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState<CartItemWithProductDetails | null>(null);

	const avatarImageUrl = useMemo(() => {
		return artistImageUrl || UserProfileImage;
	}, [artistImageUrl]);

	const { play } = usePlayTrack();
	const { createManualPlaylistAndPlay } = usePlaylist();
	const { status, currentProductId } = useAudioStore(
		useShallow((state) => ({
			status: state.status,
			currentProductId: state.productId,
		})),
	);

	const firstItem = items[0]!;

	const handleOpenLicenseModal = (item: CartItemWithProductDetails) => {
		setSelectedItem(item);
		setIsLicenseModalOpen(true);
	};

	const handleCloseLicenseModal = () => {
		setIsLicenseModalOpen(false);
		setSelectedItem(null);
	};

	const handleChangeLicense = (licenseId: number) => {
		if (selectedItem) {
			onUpdateItemLicense(selectedItem.cartId, licenseId);
		}
		handleCloseLicenseModal();
	};

	const handleRemoveItem = (cartId: number) => {
		onDeleteItem(cartId);
	};

	const handlePlay = async (productId: number) => {
		const index = trackIds.indexOf(productId);
		try {
			const manualReq: PlaylistManualRequest = { trackIds };
			await createManualPlaylistAndPlay(manualReq, index);
		} catch (error) {
			console.error("[CartArtistSection] playlist create failed", error);
		}
		play(productId);
	};

	const getEffectiveStatus = (pid: number): "playing" | "paused" | "default" => {
		if (currentProductId !== pid) return "default";
		if (status === "playing" || status === "paused") return status;
		return "default";
	};

	if (!items?.length) {
		return null; // Don't render section if no items for this artist
	}

	return (
		<>
			<div className="flex flex-col items-start gap-8px self-stretch rounded-[10px] p-3 outline-1 outline-hbc-black">
				<div className="flex items-center self-stretch justify-between">
					<div className="flex items-center gap-17px">
						<Link href={`/artists/${artistSlug}`}>
							<div className="relative group cursor-pointer">
								<Image
									className="h-51px w-51px rounded-full outline-2 outline-offset-[-1px] outline-black"
									src={avatarImageUrl}
									alt={artistName}
									width={51 * 4}
									height={51 * 4}
								/>
							</div>
						</Link>
						<div className="flex items-center gap-5px">
							<Link
								href={`/artists/${artistSlug}`}
								className="text-base font-bold text-black font-suisse"
							>
								<span>{artistName}</span>
							</Link>
							<SmallAuthBadge />
						</div>
					</div>
					<div className="font-medium leading-none text-black text-12px tracking-012px font-suisse">
						{items.length} Tracks
					</div>
				</div>
				{items.map((item) => (
					<div
						key={item.cartId}
						className="flex flex-col items-start gap-2.5 self-stretch border-t border-dashed border-hbc-black bg-hbc-white py-3"
					>
						<div className="flex items-center self-stretch justify-between h-80px">
							<div className="flex items-center justify-start gap-13px">
								<div
									className="relative group cursor-pointer"
									onClick={() => handlePlay(item.productId)}
								>
									<Image
										className="h-80px w-80px rounded-[5px] border-black"
										src={item.imageUrl || "/placeholder-image.png"}
										alt={item.title}
										width={79 * 4}
										height={79 * 4}
									/>
									{getEffectiveStatus(item.productId) !== "default" && (
										<div className="absolute inset-0 flex items-center justify-center bg-black/30">
											{getEffectiveStatus(item.productId) === "playing" ? <PauseCircle /> : <PlayCircle />}
										</div>
									)}
								</div>
								<div className="flex flex-col items-start justify-between h-20 py-1">
									<div className="flex items-center justify-start overflow-hidden">
										<Link
											href={`/products/${item.productId}`}
											className="h-6 text-20px font-bold leading-120% tracking-02px text-black truncate font-suit w-80"
										>
											{item.title}
										</Link>
										{item.type === "acapella" && <Acapella />}
										{item.type === "beat" && <Beat />}
									</div>
									<div className="flex h-4 w-auto items-center justify-start gap-2.5 py-[5px]">
										<div className="font-medium leading-16px text-12px tracking-012px font-suisse text-hbc-gray-400">
											{item.licenseName} ({item.licenseDescription})
										</div>
									</div>
									<div className="flex items-center justify-center gap-2.5 overflow-hidden rounded-[5px]">
										<button
											className="text-12px font-bold leading-16px tracking-012px text-[#001EFF] font-suit cursor-pointer"
											onClick={() => handleOpenLicenseModal(item)}
										>
											라이센스 변경
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
										handleRemoveItem(item.cartId);
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
					productId={selectedItem.productId}
					currentLicenseId={selectedItem.selectedLicenseId}
					availableLicenses={selectedItem.availableLicenses}
					onChangeLicense={handleChangeLicense}
				/>
			)}
		</>
	);
};
