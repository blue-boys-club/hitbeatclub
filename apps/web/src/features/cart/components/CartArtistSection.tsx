"use client";

import { Acapella, Beat, CloseMosaic, SmallAuthBadge } from "@/assets/svgs";
import UI from "@/components/ui";
import Image from "next/image";
import { useState } from "react";
import { LicenseChangeModal } from "./modal/LicenseChangeModal";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

type CartItem = {
	id: number;
	imageUrl: string;
	title: string;
	license: "exclusive" | "master";
	type: "acapella" | "beat";
	price: number;
};

const licenseMap = {
	exclusive: "Exclusive (mp3, wav, stems)",
	master: "Master (mp3, wav, stems)",
};

const cartItems: CartItem[] = [
	{
		id: 1,
		imageUrl: "https://placehold.co/79x79.png",
		title: "코드쿤스트 & 빈지노 타입 아카펠라 아카펠라 아카펠라 아카펠라 아카펠라",
		license: "exclusive",
		type: "acapella",
		price: 100000,
	},
	{
		id: 2,
		imageUrl: "https://placehold.co/79x79.png",
		title: "코드쿤스트 & 빈지노 타입 비트 비트 비트 비트 비트 비트 비트 비트 비트 비트",
		license: "master",
		type: "beat",
		price: 200000,
	},
];

type CardArtist = {
	id: number;
	imageUrl: string;
	name: string;
	cartItems: CartItem[];
};

const cardArtist: CardArtist = {
	id: 1,
	imageUrl: "https://placehold.co/51x51.png",
	name: "Beenzino",
	cartItems,
};

export const CartArtistSection = ({ sectionItem = cardArtist }: { sectionItem?: CardArtist }) => {
	const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
	const { toast } = useToast();

	// 라이센스 변경 mutation
	const changeLicenseMutation = useMutation({
		mutationFn: async ({ itemId, license }: { itemId: number; license: "exclusive" | "master" }) => {
			// API 호출을 모방하는 Promise
			// TODO: 라이센스 변경 로직 구현
			return new Promise<void>((resolve) => {
				// 실제 구현에서는 실제 API 엔드포인트를 호출
				console.log(`라이센스 변경 요청: itemId=${itemId}, license=${license}`);
				// API 호출 지연 시뮬레이션
				setTimeout(() => {
					resolve();
				}, 500);
			});
		},
		onSuccess: () => {
			// 성공 시 추가 작업 (예: toast 메시지, 카트 데이터 리프레시 등)
			console.log("라이센스 변경 성공");
			// 여기서 리프레시나 필요한 작업 수행
			// queryClient.invalidateQueries({ queryKey: ["cart"] });
			toast({
				description: "라이센스 옵션이 변경 되었습니다.",
			});
		},
		onError: (error) => {
			console.error("라이센스 변경 실패:", error);
			toast({
				description: "라이센스 변경 중 오류가 발생했습니다.",
				variant: "destructive",
			});
		},
	});

	const handleOpenLicenseModal = (item: CartItem) => {
		setSelectedItem(item);
		setIsLicenseModalOpen(true);
	};

	const handleCloseLicenseModal = () => {
		setIsLicenseModalOpen(false);
		setSelectedItem(null);
	};

	const handleChangeLicense = (id: number, license: "exclusive" | "master") => {
		changeLicenseMutation.mutate({ itemId: id, license });
		handleCloseLicenseModal();
	};

	const handleRemoveItem = (id: number) => {
		// TODO: 장바구니에서 삭제 로직 구현
		toast({
			description: "장바구니에서 삭제 되었습니다.",
		});
	};

	return (
		<>
			<div className="flex flex-col items-start gap-8px self-stretch rounded-[10px] p-3 outline-1 outline-hbc-black">
				<div className="flex items-center self-stretch justify-between">
					<div className="flex items-center gap-17px">
						<Image
							className="h-51px w-51px rounded-full outline-2 outline-offset-[-1px] outline-black"
							src={sectionItem.imageUrl}
							alt={sectionItem.name}
							width={51 * 4}
							height={51 * 4}
						/>
						<div className="flex items-center gap-5px">
							<div className="text-base font-bold text-black font-suisse">
								<span>{sectionItem.name}</span>
							</div>
							<SmallAuthBadge />
						</div>
					</div>
					<div className="font-medium leading-none text-black text-12px tracking-012px font-suisse">
						{cartItems.length} Tracks
					</div>
				</div>
				{cartItems.map((item) => (
					<div
						key={item.id}
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
									<div className="flex h-4 w-40 items-center justify-start gap-2.5 py-[5px]">
										<div className="w-40 font-medium leading-16px text-12px tracking-012px font-suisse text-hbc-gray-400">
											{licenseMap[item.license]}
										</div>
									</div>
									<div className="flex items-center justify-center gap-2.5 overflow-hidden rounded-[5px]">
										<button
											className="text-12px font-bold leading-16px tracking-012px text-[#001EFF] font-suit cursor-pointer"
											onClick={() => handleOpenLicenseModal(item)}
											disabled={changeLicenseMutation.isPending}
										>
											{changeLicenseMutation.isPending && item.id === selectedItem?.id ? "변경 중..." : "라이센스 변경"}
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
										handleRemoveItem(item.id);
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
					currentLicenseId={selectedItem.license}
					currentItemId={selectedItem.id}
					onChangeLicense={handleChangeLicense}
				/>
			)}
		</>
	);
};
