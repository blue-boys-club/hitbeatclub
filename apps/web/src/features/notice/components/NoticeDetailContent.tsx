"use client";
import { BackArrow } from "@/assets/svgs/BackArrow";
import { Button } from "@/components/ui/Button";
import React from "react";
import { useRouter } from "next/navigation";
import { NoticeDetailContentProps } from "../notice.types";
import Image from "next/image";

// 이미지 파일 확장자 체크 함수
const isImageFile = (fileName: string): boolean => {
	const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg"];
	const extension = fileName.toLowerCase().substring(fileName.lastIndexOf("."));
	return imageExtensions.includes(extension);
};

export const NoticeDetailContent = ({ data, onDelete }: NoticeDetailContentProps) => {
	const router = useRouter();

	const handleDelete = () => {
		if (window.confirm("정말 삭제하시겠습니까?")) {
			onDelete();
		}
	};

	const handleDownload = (file: any) => {
		const link = document.createElement("a");
		link.href = file.url;
		link.download = file.originalName;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<div>
			<div className="flex w-full justify-end items-center gap-2 pt-3 px-5">
				<Button
					variant="outline"
					size="sm"
					rounded="full"
					fontWeight="semibold"
					className="border-3 justify-center flex items-center gap-2 text-hbc-black text-[20px] font-semibold"
					onClick={() => router.push(`/notices/${data.id}/edit`)}
				>
					수정
				</Button>
				<Button
					variant="outline"
					size="sm"
					rounded="full"
					fontWeight="semibold"
					className="border-3 justify-center flex items-center gap-2 text-hbc-black text-[20px] font-semibold"
					onClick={handleDelete}
				>
					삭제
				</Button>
				<Button
					variant="outline"
					size="sm"
					rounded="full"
					fontWeight="semibold"
					className="border-3 justify-center flex items-center gap-2 text-hbc-black text-[20px] font-semibold"
					onClick={() => router.push("/notices")}
				>
					Back
					<BackArrow />
				</Button>
			</div>
			<section className="py-10 px-20">
				{/* 첨부파일 목록 */}
				{data.files && data.files.filter((file) => !isImageFile(file.originalName)).length > 0 && (
					<div className="mb-6">
						<h3 className="text-lg font-semibold text-hbc-black mb-3">첨부파일</h3>
						<div className="space-y-2">
							{data.files
								.filter((file) => !isImageFile(file.originalName))
								.map((file) => (
									<div
										key={file.id}
										className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50"
									>
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
												<span className="text-blue-600 text-sm font-medium">FILE</span>
											</div>
											<span className="text-gray-700 font-medium">{file.originalName}</span>
										</div>
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleDownload(file)}
											className="text-blue-600 border-blue-600 hover:bg-blue-50"
										>
											다운로드
										</Button>
									</div>
								))}
						</div>
					</div>
				)}

				{/* 이미지 파일들 표시 */}
				{data.files &&
					data.files
						.filter((file) => isImageFile(file.originalName))
						.map((file) => (
							<div
								key={file.id}
								style={{ position: "relative", width: "100%", minHeight: 200, marginBottom: 16 }}
							>
								<Image
									src={file.url}
									alt={file.originalName}
									fill
									style={{ objectFit: "contain" }}
									sizes="100vw"
									className="w-full h-auto"
								/>
							</div>
						))}

				<div className="text-hbc-black font-['SUIT'] text-base font-semibold leading-[160%] tracking-[-0.32px]">
					{data.content}
				</div>
			</section>
		</div>
	);
};
