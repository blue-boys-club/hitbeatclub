"use client";
import { useUploadFileMutation } from "@/apis/notice/mutations/useUploadFileMutation";
import { Button } from "@/components/ui/Button";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { NoticeCreateContentProps, UploadedFile } from "../notice.types";

export const NoticeCreateContent = ({
	content,
	setContent,
	setUploadedFileIds,
	onCreateNotice,
}: NoticeCreateContentProps) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
	const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());

	const { mutate: uploadFile, isPending: isUploading } = useUploadFileMutation();

	const handleCreateNotice = () => {
		onCreateNotice();
	};

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
		}
	}, []);

	// uploadedFiles가 변경될 때마다 uploadedFileIds 업데이트
	useEffect(() => {
		const fileIds = uploadedFiles.map((file) => file.id);
		setUploadedFileIds(fileIds);
	}, [uploadedFiles]);

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = event.target.files;
		if (selectedFiles) {
			// 여러 파일을 순차적으로 업로드
			Array.from(selectedFiles).forEach((file) => {
				// 업로드 중인 파일 목록에 추가
				setUploadingFiles((prev) => new Set(prev).add(file.name));

				uploadFile(
					{ type: "NOTICE_FILE", file },
					{
						onSuccess: (response) => {
							// 파일 업로드 성공 시 응답 데이터 처리
							console.log("파일 업로드 성공:", response);

							const newFile: UploadedFile = {
								id: response.data.id,
								url: response.data.url,
								name: file.name,
							};

							// 업로드된 파일 목록에 추가
							setUploadedFiles((prev) => [...prev, newFile]);

							// 업로드 중인 파일 목록에서 제거
							setUploadingFiles((prev) => {
								const newSet = new Set(prev);
								newSet.delete(file.name);
								return newSet;
							});

							// 성공 메시지 표시 (선택사항)
							alert(`${file.name} 파일이 성공적으로 업로드되었습니다!`);
						},
						onError: (error) => {
							console.error("파일 업로드 실패:", error);
							alert(`${file.name} 파일 업로드에 실패했습니다.`);

							// 업로드 중인 파일 목록에서 제거
							setUploadingFiles((prev) => {
								const newSet = new Set(prev);
								newSet.delete(file.name);
								return newSet;
							});
						},
					},
				);
			});
		}

		// 파일 입력 초기화 (같은 파일을 다시 선택할 수 있도록)
		event.target.value = "";
	};

	// 파일 삭제 함수
	const handleFileDelete = (fileId: number, fileName: string) => {
		if (window.confirm(`${fileName} 파일을 삭제하시겠습니까?`)) {
			setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
			console.log(`파일 삭제됨: ${fileName} (ID: ${fileId})`);
		}
	};

	// 이미지 파일인지 확인하는 함수
	const isImageFile = (fileName: string): boolean => {
		const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
		const extension = fileName.toLowerCase().substring(fileName.lastIndexOf("."));
		return imageExtensions.includes(extension);
	};

	// 이미지 파일들만 필터링
	const imageFiles = uploadedFiles.filter((file) => isImageFile(file.name));

	return (
		<section>
			<div className="pt-3 px-5 flex justify-end gap-2">
				<input
					ref={fileInputRef}
					type="file"
					multiple
					onChange={handleFileSelect}
					className="hidden"
				/>
				<Button
					variant="outline"
					size="sm"
					rounded="full"
					fontWeight="semibold"
					className="border-3 justify-center flex items-center gap-2 text-hbc-black text-[20px] font-semibold"
					onClick={() => fileInputRef.current?.click()}
					disabled={isUploading || uploadingFiles.size > 0}
				>
					{isUploading || uploadingFiles.size > 0 ? "업로드 중..." : "파일첨부 하기"}
				</Button>
				<Button
					variant="outline"
					size="sm"
					rounded="full"
					fontWeight="semibold"
					className="border-3 justify-center flex items-center gap-2 text-hbc-black text-[20px] font-semibold"
					onClick={handleCreateNotice}
				>
					공지사항 저장
				</Button>
			</div>

			{/* 업로드 중인 파일들 표시 */}
			{uploadingFiles.size > 0 && (
				<div className="px-5 py-2">
					<p className="text-sm text-orange-600 mb-2">업로드 중인 파일들:</p>
					{Array.from(uploadingFiles).map((fileName, index) => (
						<p
							key={index}
							className="text-sm text-orange-500 ml-2"
						>
							• {fileName} (업로드 중...)
						</p>
					))}
				</div>
			)}

			{/* 업로드된 파일들 표시 */}
			{uploadedFiles.length > 0 && (
				<div className="px-5 py-2">
					<p className="text-sm text-green-600 mb-2">업로드 완료된 파일들:</p>
					{uploadedFiles.map((file, index) => (
						<div
							key={file.id}
							className="flex items-center justify-between text-sm text-green-500 ml-2 mb-1 p-2 bg-green-50 rounded"
						>
							<div className="flex items-center gap-2">
								<span>• {file.name}</span>
							</div>
							<button
								onClick={() => handleFileDelete(file.id, file.name)}
								className="text-red-500 hover:text-red-700 font-bold text-lg px-2 py-1 rounded hover:bg-red-100 transition-colors"
								title={`${file.name} 삭제`}
							>
								×
							</button>
						</div>
					))}
					<p className="text-sm text-blue-600 mt-2">총 {uploadedFiles.length}개 파일</p>
				</div>
			)}

			{/* 이미지 파일들 표시 */}
			{imageFiles.length > 0 && (
				<div className="px-20">
					{imageFiles.map((file) => (
						<div
							key={file.id}
							style={{ position: "relative", width: "100%", minHeight: 200, marginBottom: 16 }}
							className="group"
						>
							<Image
								src={file.url}
								alt={file.name}
								fill
								style={{ objectFit: "contain" }}
								sizes="100vw"
								className="w-full h-auto"
							/>
						</div>
					))}
				</div>
			)}

			<div className="py-10 px-20">
				<textarea
					ref={textareaRef}
					value={content}
					className="w-full h-full outline-none resize-none text-hbc-black font-suit text-base font-semibold leading-[1.6] tracking-[-0.32px]"
					placeholder="내용을 입력해주세요"
					onChange={(e) => {
						const target = e.target as HTMLTextAreaElement;
						target.style.height = "auto";
						target.style.height = target.scrollHeight + "px";
						setContent(e.target.value);
					}}
				/>
			</div>
		</section>
	);
};
