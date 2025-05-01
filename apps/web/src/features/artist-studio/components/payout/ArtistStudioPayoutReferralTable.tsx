"use client";

import { cn } from "@/common/utils/tailwind";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";

type ReferralColumn = {
	userRegisterDate: Date; // 가입일
	userId: string; // 유입자 ID
	promotionCode: string; // 프로모션 코드 (HITCODe)
	promotionCodeType: string; // 구분
	payments: number; // 결제금액
	earnings: number; // 수익금
	status: string; // 정산상태
};

interface ArtistStudioPayoutReferralTableProps {
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
export const referralMockQueryOptions = (artistId: string) =>
	queryOptions({
		queryKey: ["TODO", "artist", artistId, "referral"],
		queryFn: () => {
			return Promise.resolve(
				Array.from({ length: 10 }, (_, index) => ({
					userRegisterDate: new Date(),
					userId: `userId${index}`,
					promotionCode: `promotionCode${index}`,
					promotionCodeType: `promotionCodeType${index}`,
					payments: 50000 + index * 500,
					earnings: 5000 + index * 50,
					status: index % 2 === 0 ? "완료" : "예정",
				})),
			);
		},
	});

// Column Definitions
const referralColumns: ColumnDef<ReferralColumn>[] = [
	{ accessorKey: "userRegisterDate", header: "가입일", cell: ({ row }) => formatDate(row.original.userRegisterDate) },
	{ accessorKey: "userId", header: "유입자 ID" },
	{ accessorKey: "promotionCode", header: "프로모션 코드" },
	{ accessorKey: "promotionCodeType", header: "구분" },
	{ accessorKey: "payments", header: "결제금액", cell: ({ row }) => formatCurrency(row.original.payments) },
	{ accessorKey: "earnings", header: "수익금", cell: ({ row }) => formatCurrency(row.original.earnings) },
	{ accessorKey: "status", header: "정산상태" }, // Add styling if needed
];

// Restore widthClasses array
const widthClasses = [
	"w-24", // 가입일
	"w-28", // 유입자 ID
	"w-40", // 프로모션 코드
	"w-40", // 구분
	"w-32", // 결제금액
	"w-32", // 수익금
	"w-24", // 정산상태
];

const ArtistStudioPayoutReferralTable = ({ artistId }: ArtistStudioPayoutReferralTableProps) => {
	const { data: referralData, isLoading } = useQuery(referralMockQueryOptions(artistId));

	const data = useMemo(() => referralData ?? [], [referralData]);
	const columns = useMemo(() => referralColumns, []);

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
								// Restore original alignment and classes
								const alignClass = "justify-center";

								return (
									// Restore widthClasses[index], flex, alignClass
									<th
										key={header.id}
										className={`${widthClasses[index] || ""} px-1 flex ${alignClass} items-center text-16px font-bold leading-150% tracking-016px text-black font-suit`}
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
									// Restore original alignment and classes
									const alignClass = "justify-center";
									const fontClass = "font-suisse";

									return (
										<td
											key={cell.id}
											className={cn(
												widthClasses[cellIndex],
												"h-6",
												"flex",
												alignClass,
												"items-center",
												"text-16px",
												"font-medium",
												"leading-150%",
												"tracking-016px",
												"text-black",
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

export default ArtistStudioPayoutReferralTable;
