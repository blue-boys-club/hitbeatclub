"use client";
import { cn } from "@/common/utils";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";

type SettlementColumn = {
	settlementBaseDate: Date; // 기준일
	settlementId: string; // 정산번호
	status: string; // 상태
	settlementDoneDate: Date; // 정산 완료 날짜
	settlementAmount: number; // 정산금액
};

interface ArtistStudioPayoutSettlementTableProps {
	artistId: string;
}

// Helper for date formatting
const formatDate = (date: Date) => {
	return date.toLocaleDateString("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
};

// Helper for currency formatting
const formatCurrency = (amount: number) => {
	// return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(amount);
	const formattedNumber = new Intl.NumberFormat("ko-KR").format(amount); // Format with commas
	return `${formattedNumber} KRW`;
};

// Mock Query
export const settlementMockQueryOptions = (artistId: string) =>
	queryOptions({
		queryKey: ["TODO", "artist", artistId, "settlement"],
		queryFn: () => {
			return Promise.resolve(
				Array.from({ length: 10 }, (_, index) => ({
					settlementBaseDate: new Date(),
					settlementId: `settlementId${index}`,
					// Add varying statuses for visual confirmation
					status: index % 3 === 0 ? "정산 완료" : index % 3 === 1 ? "정산 예정" : "정산 불가",
					settlementDoneDate: new Date(),
					settlementAmount: 100000 + index * 1000,
				})),
			);
		},
	});

// Column Definitions
const settlementColumns: ColumnDef<SettlementColumn>[] = [
	{
		accessorKey: "settlementBaseDate",
		header: "기준일",
		cell: ({ row }) => formatDate(row.original.settlementBaseDate),
	},
	{ accessorKey: "settlementId", header: "정산번호" },
	{
		accessorKey: "status",
		header: "상태",
		cell: ({ row }) => {
			const status = row.original.status;
			let textColor = "text-black";
			if (status === "정산 완료") textColor = "text-blue-700";
			if (status === "정산 불가") textColor = "text-red-600";
			return <span className={`text-base font-bold font-suit ${textColor}`}>{status}</span>;
		},
	},
	{
		accessorKey: "settlementDoneDate",
		header: "정산 완료 날짜",
		cell: ({ row }) => formatDate(row.original.settlementDoneDate),
	},
	{
		accessorKey: "settlementAmount",
		header: "정산금액",
		cell: ({ row }) => formatCurrency(row.original.settlementAmount),
	},
];

// Restore widthClasses array
const widthClasses = [
	"w-24", // 기준일
	"w-36", // 정산번호
	"w-24", // 상태
	"w-28", // 정산 완료 날짜
	"w-28", // 정산금액
];

const ArtistStudioPayoutSettlementTable = ({ artistId }: ArtistStudioPayoutSettlementTableProps) => {
	const { data: settlementData, isLoading } = useQuery(settlementMockQueryOptions(artistId));

	const data = useMemo(() => settlementData ?? [], [settlementData]);
	const columns = useMemo(() => settlementColumns, []);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		// Add overflow-x-auto to the outer div
		<div className="w-full border-t-[3px] border-b-[3px] border-black overflow-x-auto">
			{/* Keep w-full */}
			<table className="w-full">
				<thead className="border-b-[3px] border-black">
					{table.getHeaderGroups().map((headerGroup) => (
						// Restore inline-flex, justify-between, w-full
						<tr
							key={headerGroup.id}
							className="inline-flex justify-between items-center w-full py-[5px] px-2"
						>
							{headerGroup.headers.map((header, index) => {
								return (
									// Restore widthClasses[index], flex, and original cn logic
									<th
										key={header.id}
										className={cn(
											widthClasses[index],
											"px-1 flex items-center text-base font-bold leading-normal tracking-tight text-black font-suit",
											// Keep original alignment logic if needed, but inline-flex might override text-align
											// index === headerGroup.headers.length - 1 ? "justify-end" : "justify-start", // Use justify-content with flex
										)}
									>
										{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
									</th>
								);
							})}
						</tr>
					))}
				</thead>
				<tbody>
					{isLoading ? (
						<tr>
							<td
								colSpan={columns.length}
								className="h-24 text-center"
							>
								Loading...
							</td>
						</tr>
					) : table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row, rowIndex) => (
							// Restore inline-flex, justify-between, w-full
							<tr
								key={row.id}
								className={cn(
									"inline-flex justify-between items-center w-full h-8 px-2 py-[5px]",
									rowIndex % 2 !== 0 && "bg-[#d9d9d9]", // Slightly lighter alternating bg
								)}
							>
								{row.getVisibleCells().map((cell, cellIndex) => {
									// Restore original alignment and font logic
									const alignClass = cellIndex === row.getVisibleCells().length - 1 ? "justify-end" : "justify-start";
									const fontClass = cell.column.id === "status" ? "" : "font-suisse"; // Use suisse for non-status cells

									return (
										// Restore widthClasses[cellIndex], flex, alignClass, fontClass
										<td
											key={cell.id}
											className={cn(
												widthClasses[cellIndex],
												"h-6 flex items-center text-16px font-medium leading-150% tracking-016px text-black",
												alignClass,
												fontClass,
											)}
										>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</td>
									);
								})}
							</tr>
						))
					) : (
						<tr>
							<td
								colSpan={columns.length}
								className="h-24 text-center"
							>
								내역이 없습니다.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default ArtistStudioPayoutSettlementTable;
