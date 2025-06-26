"use client";
import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Delete, Edit, SmallEqualizer } from "@/assets/svgs";
import { AlbumCoverCard, Badge } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { ArtistProductListFilter } from "@/components/filters/ArtistProductListFilter";
import { getArtistMeQueryOption } from "@/apis/artist/query/artist.query-options";
import ArtistStudioTrackModal from "@/features/artist/components/modal/ArtistStudioTrackModal";
import ArtistStudioDashDeleteTrackModal from "@/features/artist/components/modal/ArtistStudioDashDeleteTrackModal";
import ArtistStudioDashCompleteModal from "@/features/artist/components/modal/ArtistStudioDashCompleteModal";
import { useArtistProductParametersStateByKey } from "@/features/artist/hooks/useArtistProductParameters";
import blankCdImage from "@/assets/images/blank-cd.png";
import { AudioProvider } from "@/contexts/AudioContext";

const ArtistStudioDashboardContentList = () => {
	const [editingProductId, setEditingProductId] = useState<number | null>(null);
	const [isDeleteTrackOpen, setIsDeleteTrackOpen] = useState<boolean>(false);
	const [isCompleteOpen, setIsCompleteOpen] = useState<boolean>(false);
	const [productListData, setProductListData] = useState<any>(null);

	// nuqs를 사용한 pagination 상태 관리
	const [currentPage, setCurrentPage] = useArtistProductParametersStateByKey("page");

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

	// Pagination 관련 계산
	const currentPageNum = typeof currentPage === "number" ? currentPage : currentPage ? parseInt(currentPage, 10) : 1;
	const totalPages = productListData?._pagination
		? Math.ceil(productListData._pagination.total / productListData._pagination.limit)
		: 0;
	const canGoPrevious = currentPageNum > 1;
	const canGoNext = currentPageNum < totalPages;

	// Pagination 핸들러 (useCallback으로 최적화)
	const handlePreviousPage = useCallback(() => {
		if (canGoPrevious) {
			setCurrentPage((currentPageNum - 1).toString());
		}
	}, [canGoPrevious, currentPageNum, setCurrentPage]);

	const handleNextPage = useCallback(() => {
		if (canGoNext) {
			setCurrentPage((currentPageNum + 1).toString());
		}
	}, [canGoNext, currentPageNum, setCurrentPage]);

	const handlePageChange = useCallback(
		(page: number) => {
			setCurrentPage(page.toString());
		},
		[setCurrentPage],
	);

	// 페이지 번호 배열 생성 (useMemo로 최적화)
	const pageNumbers = useMemo(() => {
		if (totalPages <= 1) return [1]; // 페이지가 1개 이하여도 [1] 반환

		const pages = [];
		const maxVisiblePages = 5;
		const startPage = Math.max(1, currentPageNum - Math.floor(maxVisiblePages / 2));
		const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}
		return pages;
	}, [totalPages, currentPageNum]);

	// 페이지 정보 텍스트 (useMemo로 최적화)
	const paginationInfo = useMemo(() => {
		if (!productListData?._pagination) return null;

		const { total, limit } = productListData._pagination;
		const startItem = (currentPageNum - 1) * limit + 1;
		const endItem = Math.min(currentPageNum * limit, total);

		// 더 자연스러운 표현 방식
		if (total === 0) {
			return "결과가 없습니다";
		} else if (total === 1) {
			return "총 1개";
		} else if (startItem === endItem) {
			return `총 ${total}개 중 ${startItem}번째`;
		} else if (total <= limit) {
			return `총 ${total}개`;
		} else {
			return `총 ${total}개 중 ${startItem}~${endItem}번째`;
		}
	}, [productListData?._pagination, currentPageNum]);

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
					productId={product.id}
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
									{product.isPublic === 1 ? "공개" : "비공개"}
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
		<AudioProvider>
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

				{/* Pagination - 항상 표시 */}
				<div className="flex justify-center items-center gap-2 mt-6 mb-4">
					{totalPages > 1 && (
						<Button
							variant="outline"
							size="sm"
							onClick={handlePreviousPage}
							disabled={!canGoPrevious}
							className="px-3 py-1"
						>
							&lt;
						</Button>
					)}

					{pageNumbers.map((pageNum: number) => (
						<Button
							key={pageNum}
							variant={currentPageNum === pageNum ? "fill" : "outline"}
							size="sm"
							onClick={() => handlePageChange(pageNum)}
							className="px-3 py-1"
							disabled={totalPages <= 1}
						>
							{pageNum}
						</Button>
					))}

					{totalPages > 1 && (
						<Button
							variant="outline"
							size="sm"
							onClick={handleNextPage}
							disabled={!canGoNext}
							className="px-3 py-1"
						>
							&gt;
						</Button>
					)}
				</div>

				{/* 페이지 정보 표시 */}
				{paginationInfo && <div className="text-center text-sm text-gray-600 mb-4">{paginationInfo}</div>}
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
		</AudioProvider>
	);
};

export default ArtistStudioDashboardContentList;
