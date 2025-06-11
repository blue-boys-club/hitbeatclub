"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Delete, Edit, SmallEqualizer } from "@/assets/svgs";
import { AlbumCoverCard, Badge } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { ArtistProductListFilter } from "@/components/filters/ArtistProductListFilter";
import { getArtistMeQueryOption } from "@/apis/artist/query/artist.query-options";
import ArtistStudioTrackModal from "@/features/artist/components/modal/ArtistStudioTrackModal";
import ArtistStudioDashDeleteTrackModal from "@/features/artist/components/modal/ArtistStudioDashDeleteTrackModal";
import ArtistStudioDashCompleteModal from "@/features/artist/components/modal/ArtistStudioDashCompleteModal";
import blankCdImage from "@/assets/images/blank-cd.png";

const ArtistStudioDashboardContentList = () => {
	const [editingProductId, setEditingProductId] = useState<number | null>(null);
	const [isDeleteTrackOpen, setIsDeleteTrackOpen] = useState<boolean>(false);
	const [isCompleteOpen, setIsCompleteOpen] = useState<boolean>(false);
	const [productListData, setProductListData] = useState<any>(null);

	// 현재 아티스트 정보 조회
	const { data: artistMe } = useQuery(getArtistMeQueryOption());

	const openEditTrackModal = (id: number) => setEditingProductId(id);
	const closeEditTrackModal = () => setEditingProductId(null);
	const openDeleteTrackModal = () => setIsDeleteTrackOpen(true);
	const closeDeleteTrackModal = () => setIsDeleteTrackOpen(false);
	const openCompleteModal = () => setIsCompleteOpen(true);
	const closeCompleteModal = () => setIsCompleteOpen(false);

	// 필터에서 받은 데이터 처리
	const handleDataChange = (data: any) => {
		setProductListData(data);
	};

	// 상품 목록 렌더링
	const renderProductList = () => {
		if (!productListData?.data) {
			return <div className="text-center py-8 text-gray-500">상품이 없습니다.</div>;
		}

		return productListData.data.map((product: any) => (
			<div
				key={product.id}
				className="flex gap-4 border-b-hbc-black bg-hbc-white py-3 px-2 border-b-4 border-black"
			>
				<AlbumCoverCard
					albumImgSrc={product.coverImage?.url || blankCdImage}
					size={"xl"}
					AlbumCoverCardWrapperClassName={"rounded-full"}
					AlbumCoverCardInnerClassName={"rounded-full"}
				/>
				<div className="flex-grow flex justify-between gap-2">
					<div>
						<div className="flex flex-col gap-3">
							<div className="flex gap-3 items-center">
								<span className="text-hbc-black text-[26px] font-bold leading-[100%] tracking-[0.26px]">
									{product.productName}
								</span>
								<Badge
									variant={product.isPublic ? "default" : "secondary"}
									size={"sm"}
									rounded={true}
								>
									{product.isPublic ? "공개" : "비공개"}
								</Badge>
							</div>
							<div className="flex gap-1">
								{product.genres?.map((genre: any) => (
									<Badge
										key={genre.id}
										size={"sm"}
										rounded={true}
										bold={"semibold"}
									>
										{genre.name}
									</Badge>
								))}
							</div>
							<div className="text-hbc-black text-base font-[450] leading-[150%] tracking-[0.16px]">
								<div>
									BPM :{" "}
									{product.minBpm === product.maxBpm
										? `${product.minBpm}BPM`
										: `${product.minBpm}-${product.maxBpm}BPM`}
								</div>
								<div>
									Key : {product.musicKey} {product.scaleType?.toLowerCase()}
								</div>
								<div>Basic : {product.price?.toLocaleString()} KRW</div>
							</div>
						</div>
					</div>
					<div className="flex flex-col justify-between items-end">
						<div className="flex gap-2 ">
							<Button
								variant="outline"
								size="sm"
								rounded="full"
								className="flex gap-1.5 border-1"
								onClick={() => openEditTrackModal(product.id)}
							>
								<div className="text-hbc-black text-[12px] font-suit font-bold leading-[100%] tracking-[0.12px]">
									수정하기
								</div>
								<Edit />
							</Button>
							<Button
								variant="outline"
								size="sm"
								rounded="full"
								className="flex gap-1.5 border-1"
								onClick={openDeleteTrackModal}
							>
								<div className="text-hbc-black text-[12px] font-suit font-bold leading-[100%] tracking-[0.12px]">
									삭제하기
								</div>
								<Delete />
							</Button>
						</div>
						<div>
							<SmallEqualizer />
						</div>
					</div>
				</div>
			</div>
		));
	};

	// artistMe가 없으면 로딩 상태 표시
	if (!artistMe?.id) {
		return (
			<section>
				<div className="border-b-6 pl-[2px] pb-2 text-hbc-black text-[24px] font-extrabold leading-[100%] tracking-[0.24px]">
					컨텐츠 목록
				</div>
				<div className="text-center py-8 text-gray-500">아티스트 정보를 불러오는 중...</div>
			</section>
		);
	}

	return (
		<>
			<section>
				<div className="border-b-6 pl-[2px] pb-2 text-hbc-black text-[24px] font-extrabold leading-[100%] tracking-[0.24px]">
					컨텐츠 목록
				</div>

				{/* 필터 컴포넌트 */}
				<ArtistProductListFilter
					artistId={artistMe.id}
					onDataChange={handleDataChange}
				/>

				{/* 상품 목록 */}
				<div className="grid grid-cols-1">{renderProductList()}</div>
			</section>

			{editingProductId && (
				<ArtistStudioTrackModal
					mode="edit"
					isModalOpen={true}
					onClose={closeEditTrackModal}
					openCompleteModal={openCompleteModal}
					productId={editingProductId}
				/>
			)}

			<ArtistStudioDashDeleteTrackModal
				isModalOpen={isDeleteTrackOpen}
				onClose={closeDeleteTrackModal}
			/>
			<ArtistStudioDashCompleteModal
				isModalOpen={isCompleteOpen}
				onClose={closeCompleteModal}
			/>
		</>
	);
};

export default ArtistStudioDashboardContentList;
