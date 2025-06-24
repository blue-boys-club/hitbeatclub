interface PaginationProps {
	currentPage: number;
	totalPage: number;
	total: number;
	onPageChange: (page: number) => void;
	className?: string;
	itemName?: string;
}

export const Pagination = ({
	currentPage,
	totalPage,
	total,
	onPageChange,
	className = "",
	itemName = "항목",
}: PaginationProps) => {
	// 페이지 변경 핸들러
	const handlePageChange = (newPage: number) => {
		if (newPage < 1 || newPage > totalPage) return;
		onPageChange(newPage);
	};

	// 페이지 번호 배열 생성
	const getPageNumbers = () => {
		const pages = [];
		const maxVisiblePages = 5;

		if (totalPage <= maxVisiblePages) {
			// 전체 페이지가 5개 이하면 모든 페이지 표시
			for (let i = 1; i <= totalPage; i++) {
				pages.push(i);
			}
		} else {
			// 현재 페이지를 중심으로 5개 페이지 표시
			let startPage = Math.max(1, currentPage - 2);
			let endPage = Math.min(totalPage, startPage + maxVisiblePages - 1);

			// 끝 페이지가 totalPage에 가까우면 시작 페이지 조정
			if (endPage - startPage < maxVisiblePages - 1) {
				startPage = Math.max(1, endPage - maxVisiblePages + 1);
			}

			for (let i = startPage; i <= endPage; i++) {
				pages.push(i);
			}
		}

		return pages;
	};

	return (
		<div className={className}>
			{/* 페이지네이션 버튼 */}
			<div className="flex justify-center items-center gap-1 pt-5">
				{getPageNumbers().map((pageNum) => (
					<button
						key={pageNum}
						onClick={() => handlePageChange(pageNum)}
						className={`flex items-center justify-center cursor-pointer text-base font-black ${
							pageNum === currentPage ? "text-hbc-red" : "text-hbc-black"
						}`}
					>
						{pageNum}
					</button>
				))}
			</div>
		</div>
	);
};
