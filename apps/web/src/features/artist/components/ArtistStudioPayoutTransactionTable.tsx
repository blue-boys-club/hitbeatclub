"use client";

import { checkIsPureEnglish, cn } from "@/common/utils";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import Link from "next/link";
import { useMemo } from "react";

type TransactionColumn = {
	transactionDate: Date; // 기준일
	customerId: string; // 구매자 ID
	trackName: string; //트랙명
	trackType: string; // 구분(beat/acappella)
	licenseType: string; // 라이센스 타입(exclusive/master/etc...)
	earnings: number; // 수익금
	transactionId: string; // 거래번호
};

interface ArtistStudioPayoutTransactionTableProps {
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
	const formattedNumber = new Intl.NumberFormat("ko-KR").format(amount);
	return `${formattedNumber} KRW`;
};

// Mock Query
export const transactionMockQueryOptions = (artistId: string) =>
	queryOptions({
		queryKey: ["TODO", "artist", artistId, "transaction"],
		queryFn: () => {
			return Promise.resolve(
				Array.from({ length: 10 }, (_, index) => ({
					transactionDate: new Date(),
					customerId: `customerId${index}`,
					trackName: `trackName${index} with a potentially long name to test wrapping`,
					trackType: index % 2 === 0 ? "Beat" : "Acappella",
					licenseType: index % 3 === 0 ? "Exclusive" : index % 3 === 1 ? "Master" : "Basic",
					earnings: 150000 + index * 1500,
					transactionId: `transactionId${index}`,
				})),
			);
		},
	});

// Column Definitions
const transactionColumns: ColumnDef<TransactionColumn>[] = [
	{ accessorKey: "transactionDate", header: "기준일", cell: ({ row }) => formatDate(row.original.transactionDate) },
	{ accessorKey: "customerId", header: "구매자 ID" },
	{
		accessorKey: "trackName",
		header: "트랙명",
		cell: ({ getValue }) => <span className="block truncate">{getValue<string>()}</span>,
	},
	{
		id: "typeAndLicense", // Combined column
		header: "구분 / 라이센스",
		cell: ({ row }) => {
			const trackFont = checkIsPureEnglish(row.original.trackType) ? "font-suisse font-medium" : "font-suit font-bold";
			const typeFont = checkIsPureEnglish(row.original.licenseType) ? "font-suisse font-medium" : "font-suit font-bold";
			return (
				<div className="self-stretch px-5px bg-neutral-200 rounded-4px inline-flex justify-center items-center gap-2px text-16px leading-150% tracking-016px">
					<span className={cn("justify-start", trackFont)}>{row.original.trackType}</span>
					<span className="justify-start font-bold font-suit">/</span>
					<span className={cn("justify-start", typeFont)}>{row.original.licenseType}</span>
				</div>
			);
		},
	},
	{ accessorKey: "earnings", header: "수익금", cell: ({ row }) => formatCurrency(row.original.earnings) },
	{
		accessorKey: "transactionId",
		header: "거래번호",
	},
];

// Restore widthClasses array
const widthClasses = [
	"w-32", // 기준일
	"w-36", // 구매자 ID
	"w-64", // 트랙명 (Removed truncate/ellipsis, handled by inner span)
	"w-48", // 구분 / 라이센스 (Combined)
	"w-32", // 수익금
	"w-36", // 거래번호
];

const ArtistStudioPayoutTransactionTable = ({ artistId }: ArtistStudioPayoutTransactionTableProps) => {
	const { data: transactionData, isLoading } = useQuery(transactionMockQueryOptions(artistId));

	const data = useMemo(() => transactionData ?? [], [transactionData]);
	const columns = useMemo(() => transactionColumns, []);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		// Add overflow-x-auto to the outer div
		<div className="w-full border-t-[3px] border-b-[3px] border-black overflow-x-auto">
			{/* Keep w-full, remove table-fixed if it causes issues with inline-flex */}
			<table className="w-full">
				<thead className="border-b-[3px] border-black">
					{table.getHeaderGroups().map((headerGroup) => (
						// Restore inline-flex, justify-between, w-full
						<tr
							key={headerGroup.id}
							className="inline-flex justify-between items-center w-full py-[5px] px-2"
						>
							{headerGroup.headers.map((header, index) => {
								// Restore alignment logic
								const alignClass = index < 3 ? "justify-start" : "justify-center";

								return (
									// Restore widthClasses[index], flex, alignClass
									<th
										key={header.id}
										className={`${widthClasses[index] || ""} px-1 flex ${alignClass} items-center `}
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
								className={`inline-flex justify-between items-center w-full h-8 px-2 py-[5px] ${rowIndex % 2 !== 0 ? "bg-[#d9d9d9]" : ""}`}
							>
								{row.getVisibleCells().map((cell, cellIndex) => {
									// Restore alignment logic
									const alignClass = cellIndex < 3 ? "justify-start" : "justify-center";
									const cellValue = cell.getValue();
									const valueString =
										typeof cellValue === "string" || typeof cellValue === "number" ? String(cellValue) : "";
									const fontClass = checkIsPureEnglish(valueString) ? "font-suisse" : "font-suit";

									return (
										// Restore widthClasses[cellIndex], flex, alignClass
										<td
											key={cell.id}
											className={cn(
												"h-6 flex items-center text-16px font-medium leading-150% tracking-016px text-black",
												widthClasses[cellIndex],
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

export default ArtistStudioPayoutTransactionTable;
