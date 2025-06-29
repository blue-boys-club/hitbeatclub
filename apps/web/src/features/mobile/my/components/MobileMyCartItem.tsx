import { X } from "@/assets/svgs/X";
import Image from "next/image";
import { useDeleteCartItemMutation } from "@/apis/user/mutations";
import { useToast } from "@/hooks/use-toast";
import { usePlaylistStore } from "@/stores/playlist";
import { usePlayTrack } from "@/hooks/use-play-track";
import { useShallow } from "zustand/react/shallow";
import { useCallback } from "react";

export const MobileMyCartItem = ({
	title = "La Vie En Rose",
	artist = "Moon River",
	imageUrl = "https://street-h.com/wp-content/uploads/2023/03/hanroro.jpg",
	price,
	licenseType,
	cartItemId,
	userId,
	productId,
}: {
	title?: string;
	artist?: string;
	imageUrl?: string;
	price?: number;
	licenseType?: string;
	cartItemId?: number;
	userId?: number;
	productId?: number;
}) => {
	const { toast } = useToast();
	const deleteCartItemMutation = useDeleteCartItemMutation(userId || 0);

	// 플레이리스트 스토어 및 재생 훅
	const { setPlaylist } = usePlaylistStore(
		useShallow((state) => ({
			setPlaylist: state.setPlaylist,
		})),
	);
	const { play } = usePlayTrack();

	// 앨범 커버 클릭 핸들러 (재생)
	const handleAlbumClick = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		
		if (!productId) {
			toast({
				description: "재생할 수 없는 항목입니다.",
				variant: "destructive",
			});
			return;
		}
		
		// 플레이리스트 초기화 후 해당 곡만 추가
		const playlistProduct = {
			id: productId,
			productName: title,
			coverImage: imageUrl ? { url: imageUrl } : undefined,
			seller: { stageName: artist },
		};
		
		setPlaylist([playlistProduct]);
		play(productId);
	}, [productId, title, imageUrl, artist, setPlaylist, play, toast]);

	const handleDelete = () => {
		if (!cartItemId || !userId) {
			toast({
				description: "삭제할 수 없습니다.",
				variant: "destructive",
			});
			return;
		}

		deleteCartItemMutation.mutate(cartItemId, {
			onSuccess: () => {
				toast({
					description: "장바구니에서 삭제되었습니다.",
				});
			},
			onError: (error) => {
				toast({
					description: "삭제에 실패했습니다.",
					variant: "destructive",
				});
				console.error("Delete cart item error:", error);
			},
		});
	};

	return (
		<div className="bg-[#dadada] p-2 rounded-5px flex justify-between items-center hover:bg-[#D9D9D9] cursor-pointer">
			<div className="flex gap-2">
				<div 
					className="relative w-50px h-50px rounded-5px overflow-hidden cursor-pointer"
					onClick={handleAlbumClick}
				>
					<Image
						alt="album image"
						src={imageUrl}
						fill
						className="object-cover"
					/>
				</div>
				<div className="flex flex-col gap-10px items-start">
					<div className="flex flex-col">
						<span className="font-semibold text-xs">{title}</span>
						<span className="text-10px leading-10px mt-1px">{artist}</span>
					</div>
					<button className="px-5px h-12px flex justify-center items-center font-medium text-8px leading-100% rounded-12px border-hbc-blue border-1px text-hbc-blue">
						View License {licenseType && `(${licenseType})`}
					</button>
				</div>
			</div>
			<div className="flex gap-2 items-center">
				<span className="text-10px font-semibold leading-100%">{price?.toLocaleString() || "0"} KRW</span>
				<button
					onClick={handleDelete}
					disabled={deleteCartItemMutation.isPending}
					className="disabled:opacity-50"
				>
					<X
						width="7px"
						height="7px"
					/>
				</button>
			</div>
		</div>
	);
};
