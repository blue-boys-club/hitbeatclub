interface MobileNoticePaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export const MobileNoticePagination = ({ currentPage, totalPages, onPageChange }: MobileNoticePaginationProps) => {
	const getVisiblePages = () => {
		const maxVisible = 5;
		const half = Math.floor(maxVisible / 2);
		let start = Math.max(1, currentPage - half);
		let end = Math.min(totalPages, start + maxVisible - 1);

		if (end - start + 1 < maxVisible) {
			start = Math.max(1, end - maxVisible + 1);
		}

		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	};

	const visiblePages = getVisiblePages();

	if (totalPages <= 1) {
		return null;
	}

	return (
		<div className="flex justify-center">
			<div className="flex gap-2 text-12px leading-100% font-bold">
				{visiblePages.map((page) => (
					<button
						key={page}
						onClick={() => onPageChange(page)}
						className={`cursor-pointer ${page === currentPage ? "text-hbc-red" : "text-black hover:text-hbc-red"}`}
					>
						{page}
					</button>
				))}
			</div>
		</div>
	);
};
