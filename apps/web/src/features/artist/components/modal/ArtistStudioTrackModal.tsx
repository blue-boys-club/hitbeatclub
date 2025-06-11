"use client";
import { useEffect, useMemo, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useCreateProductMutation } from "@/apis/product/mutations/useCreateProductMutation";
import { useUpdateProductMutation } from "@/apis/product/mutations";
import { useUploadProductFileMutation } from "@/apis/product/mutations/useUploadProductFileMutation";
import { PRODUCT_FILE_TYPE } from "@/apis/product/product.type";
import { ENUM_FILE_TYPE } from "@hitbeatclub/shared-types/file";
import { ProductCreateSchema } from "@hitbeatclub/shared-types/product";
import { TrackUploadFormSchema } from "@/features/artist-studio/artist-studio.types";
import { Acapella, AddCircle, Beat, LargeEqualizer, MinusCircle, Plus } from "@/assets/svgs";
import Circle from "@/assets/svgs/Circle";
import { cn } from "@/common/utils";
import { AlbumAvatar, Badge, BPMDropdown, Dropdown, Input, KeyDropdown } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { Popup, PopupContent, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import { getTagListQueryOption } from "@/apis/tag/query/tag.query-options";
import { getProductQueryOption } from "@/apis/product/query/product.query-option";
import { useQuery } from "@tanstack/react-query";
import MultiTagGenreInput from "@/components/ui/MultiTagGenreInput/MultiTagGenreInput";
import blankCdImage from "@/assets/images/blank-cd.png";

export type BPM = number | undefined;
export type BPMRange = { min?: number | undefined; max?: number | undefined } | undefined;
export type KeyValue = { label: string; value: string };

// 확장된 폼 스키마 - 파일 관련 필드 추가
const ExtendedTrackFormSchema = TrackUploadFormSchema.extend({
	// 파일 업로드 상태
	uploadedFiles: z.object({
		coverImage: z.instanceof(File).nullable(),
		audioFile: z.instanceof(File).nullable(),
		zipFile: z.instanceof(File).nullable(),
	}),
	uploadedFileIds: z.object({
		coverImageFileId: z.number().optional(),
		audioFileFileId: z.number().optional(),
		zipFileId: z.number().optional(),
	}),
	// UI 상태
	isDragOver: z.boolean(),
});

type ExtendedTrackFormData = z.infer<typeof ExtendedTrackFormSchema>;
type ProductData = z.infer<typeof ProductCreateSchema> & { id: number };

interface ArtistStudioTrackModalProps {
	mode: "upload" | "edit";
	isModalOpen: boolean;
	onClose: () => void;
	openCompleteModal: () => void;
	initialFiles?: FileList | null; // 업로드 모드에서 사이드바에서 드롭된 파일들
	productId?: number; // 편집 모드에서 상품 ID (필수)
}

const ArtistStudioTrackModal = ({
	mode,
	isModalOpen,
	onClose,
	openCompleteModal,
	initialFiles,
	productId,
}: ArtistStudioTrackModalProps) => {
	const { data: tagList } = useQuery(getTagListQueryOption());

	// 편집 모드에서만 제품 데이터 쿼리
	const { data: productData } = useQuery({
		...getProductQueryOption(productId || 0),
		enabled: mode === "edit" && !!productId,
	});

	const { mutate: createProduct, isPending: isCreating } = useCreateProductMutation();
	const { mutate: updateProduct, isPending: isUpdating } = useUpdateProductMutation(productId || 0);
	const { mutate: uploadProductFile, isPending: isUploading } = useUploadProductFileMutation();

	const isProcessing = isCreating || isUpdating || isUploading;

	// 모드에 따른 기본값 설정
	const getDefaultValues = useCallback((): ExtendedTrackFormData => {
		const baseDefaults = {
			productName: "",
			description: "",
			price: 0,
			category: "BEAT" as const,
			genres: [] as string[],
			tags: [] as string[],
			minBpm: 100,
			maxBpm: 120,
			musicKey: "null" as const,
			scaleType: "null" as const,
			licenseInfo: [
				{ type: "MASTER" as const, price: 10000 },
				{ type: "EXCLUSIVE" as const, price: 20000 },
			],
			currency: "KRW",
			isFreeDownload: 0,
			isPublic: 1,
			coverImageFileId: 1,
			audioFileFileId: 2,
			// UI 전용 필드들
			bpmType: "exact" as const,
			exactBPM: undefined,
			bpmRange: { min: undefined, max: undefined },
			keyValue: undefined,
			scaleValue: null,
			// 파일 관련 필드들
			uploadedFiles: {
				coverImage: null,
				audioFile: null,
				zipFile: null,
			},
			uploadedFileIds: {
				coverImageFileId: undefined,
				audioFileFileId: undefined,
				zipFileId: undefined,
			},
			isDragOver: false,
		};

		// 편집 모드일 때 쿼리된 데이터로 기본값 덮어쓰기
		if (mode === "edit" && productData) {
			return {
				...baseDefaults,
				productName: productData.productName,
				description: productData.description,
				price: productData.price,
				category: productData.category,
				// API 응답에서 객체 배열을 문자열 배열로 변환
				genres: productData.genres?.map((genre: any) => genre.name) || [],
				tags: productData.tags?.map((tag: any) => tag.name) || [],
				minBpm: productData.minBpm || 100,
				maxBpm: productData.maxBpm || 120,
				musicKey: (productData.musicKey as any) || "null",
				scaleType: (productData.scaleType as any) || "null",
				// 기본값 사용 (API 응답에 없는 필드들)
				licenseInfo: baseDefaults.licenseInfo,
				currency: "KRW",
				coverImageFileId: (productData as any).coverImage?.id || 1,
				audioFileFileId: (productData as any).audioFile?.id || 2,
				isFreeDownload: (productData as any).isFreeDownload || 0,
				isPublic: (productData as any).isPublic || 1,
				uploadedFileIds: {
					coverImageFileId: (productData as any).coverImage?.id,
					audioFileFileId: (productData as any).audioFile?.id,
					zipFileId: (productData as any).zipFile?.id,
				},
				// BPM 관련 필드 설정
				bpmType: productData.minBpm === productData.maxBpm ? "exact" : "range",
				exactBPM: productData.minBpm === productData.maxBpm ? productData.minBpm : undefined,
				bpmRange:
					productData.minBpm !== productData.maxBpm
						? { min: productData.minBpm, max: productData.maxBpm }
						: { min: undefined, max: undefined },
			};
		}

		return baseDefaults;
	}, [mode, productData]);

	// react-hook-form 설정
	const {
		control,
		handleSubmit,
		watch,
		setValue,
		getValues,
		trigger,
		clearErrors,
		setError,
		formState: { errors },
		reset,
	} = useForm<ExtendedTrackFormData>({
		resolver: zodResolver(ExtendedTrackFormSchema),
		defaultValues: getDefaultValues(),
	});

	// 개별 필드 watch로 성능 최적화
	const watchedCategory = watch("category");
	const watchedUploadedFiles = watch("uploadedFiles");
	const watchedIsDragOver = watch("isDragOver");
	const watchedLicenseInfo = watch("licenseInfo");

	// 모달 제목과 버튼 텍스트
	const modalTitle = mode === "upload" ? "트랙 업로드" : "트랙 수정";
	const submitButtonText = mode === "upload" ? "UPLOAD" : "SAVE";
	const loadingText = mode === "upload" ? "업로드 중..." : "저장 중...";

	// 파일 타입 확인 함수
	const getFileTypeFromExtension = useCallback((file: File): PRODUCT_FILE_TYPE | null => {
		const extension = file.name.toLowerCase().split(".").pop();

		if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
			return ENUM_FILE_TYPE.PRODUCT_COVER_IMAGE;
		}
		if (["mp3", "wav", "flac", "m4a"].includes(extension || "")) {
			return ENUM_FILE_TYPE.PRODUCT_AUDIO_FILE;
		}
		if (["zip", "rar", "7z"].includes(extension || "")) {
			return ENUM_FILE_TYPE.PRODUCT_ZIP_FILE;
		}
		return null;
	}, []);

	// 파일 업로드 처리
	const handleFileUpload = useCallback(
		async (files: FileList | null, specificType?: PRODUCT_FILE_TYPE) => {
			if (!files || files.length === 0) return;

			const file = files[0];
			if (!file) return;

			const fileType = specificType || getFileTypeFromExtension(file);
			if (!fileType) {
				setError("uploadedFiles", {
					type: "manual",
					message: "지원하지 않는 파일 형식입니다.",
				});
				return;
			}

			clearErrors("uploadedFiles");
			clearErrors("uploadedFiles.audioFile");
			clearErrors("uploadedFiles.zipFile");
			clearErrors("uploadedFiles.coverImage");

			uploadProductFile(
				{ file, type: fileType },
				{
					onSuccess: (response) => {
						const currentFiles = getValues("uploadedFiles");
						const currentFileIds = getValues("uploadedFileIds");

						switch (fileType) {
							case ENUM_FILE_TYPE.PRODUCT_COVER_IMAGE:
								setValue("uploadedFiles", { ...currentFiles, coverImage: file });
								setValue("uploadedFileIds", { ...currentFileIds, coverImageFileId: response.data.id });
								setValue("coverImageFileId", response.data.id);
								break;
							case ENUM_FILE_TYPE.PRODUCT_AUDIO_FILE:
								setValue("uploadedFiles", { ...currentFiles, audioFile: file });
								setValue("uploadedFileIds", { ...currentFileIds, audioFileFileId: response.data.id });
								setValue("audioFileFileId", response.data.id);
								break;
							case ENUM_FILE_TYPE.PRODUCT_ZIP_FILE:
								setValue("uploadedFiles", { ...currentFiles, zipFile: file });
								setValue("uploadedFileIds", { ...currentFileIds, zipFileId: response.data.id });
								break;
						}

						trigger(["uploadedFiles", "uploadedFileIds"]);
					},
					onError: (error) => {
						if (process.env.NODE_ENV === "development") {
							console.error("파일 업로드 실패:", error);
						}
						switch (fileType) {
							case ENUM_FILE_TYPE.PRODUCT_COVER_IMAGE:
								setError("uploadedFiles.coverImage", {
									type: "manual",
									message: "파일 업로드에 실패했습니다.",
								});
								break;
							case ENUM_FILE_TYPE.PRODUCT_AUDIO_FILE:
								setError("uploadedFiles.audioFile", {
									type: "manual",
									message: "파일 업로드에 실패했습니다.",
								});
								break;
							case ENUM_FILE_TYPE.PRODUCT_ZIP_FILE:
								setError("uploadedFiles.zipFile", {
									type: "manual",
									message: "파일 업로드에 실패했습니다.",
								});
								break;
						}
					},
				},
			);
		},
		[getFileTypeFromExtension, uploadProductFile, setError, clearErrors, getValues, setValue, trigger],
	);

	// 초기 파일들 처리 (업로드 모드에서만)
	useEffect(() => {
		if (mode === "upload" && isModalOpen && initialFiles && initialFiles.length > 0) {
			for (let i = 0; i < initialFiles.length; i++) {
				const file = initialFiles[i];
				if (file) {
					const fileType = getFileTypeFromExtension(file);
					if (fileType) {
						const fileList = new DataTransfer();
						fileList.items.add(file);
						handleFileUpload(fileList.files, fileType);
					} else if (i === 0) {
						setError("uploadedFiles", {
							type: "manual",
							message: "지원하지 않는 파일 형식입니다.",
						});
					}
				}
			}
		}
	}, [mode, isModalOpen, initialFiles, getFileTypeFromExtension, handleFileUpload, setError]);

	// 모달이 닫힐 때 또는 제품 데이터가 변경될 때 폼 초기화
	useEffect(() => {
		if (!isModalOpen || (mode === "edit" && productData)) {
			reset(getDefaultValues());
		}
	}, [isModalOpen, productData, reset, getDefaultValues, mode]);

	// 드래그 앤 드롭 이벤트 핸들러
	const handleDragOver = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setValue("isDragOver", true);
		},
		[setValue],
	);

	const handleDragLeave = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setValue("isDragOver", false);
		},
		[setValue],
	);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setValue("isDragOver", false);
			handleFileUpload(e.dataTransfer.files);
		},
		[setValue, handleFileUpload],
	);

	// 파일 입력 핸들러
	const handleFileInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>, type: PRODUCT_FILE_TYPE) => {
			handleFileUpload(e.target.files, type);
		},
		[handleFileUpload],
	);

	// 폼 제출 처리
	const onSubmit = useCallback(
		(data: ExtendedTrackFormData) => {
			// 업로드 모드에서는 파일 업로드 검증
			if (mode === "upload") {
				if (!data.uploadedFileIds.audioFileFileId) {
					setError("uploadedFiles.audioFile", {
						type: "manual",
						message: "오디오 파일은 필수입니다.",
					});
					return;
				}

				if (!data.uploadedFileIds.coverImageFileId) {
					setError("uploadedFiles.coverImage", {
						type: "manual",
						message: "커버 이미지는 필수입니다.",
					});
					return;
				}

				if (!data.uploadedFileIds.zipFileId) {
					setError("uploadedFiles.zipFile", {
						type: "manual",
						message: "압축 파일은 필수입니다.",
					});
					return;
				}
			}

			// musicKey와 scaleType 타입 안전성 보장
			const validMusicKeys = [
				"null",
				"C",
				"Db",
				"D",
				"Eb",
				"E",
				"F",
				"Gb",
				"G",
				"Ab",
				"A",
				"Bb",
				"B",
				"Cs",
				"Ds",
				"Fs",
				"Gs",
				"As",
			] as const;
			const validScaleTypes = ["MAJOR", "MINOR", "null"] as const;

			const musicKeyValue = data.keyValue?.value || data.musicKey || "null";
			const validatedMusicKey = validMusicKeys.includes(musicKeyValue as (typeof validMusicKeys)[number])
				? (musicKeyValue as (typeof validMusicKeys)[number])
				: "null";

			const scaleTypeValue = data.scaleValue ? data.scaleValue.toUpperCase() : data.scaleType || "null";
			const validatedScaleType = validScaleTypes.includes(scaleTypeValue as (typeof validScaleTypes)[number])
				? (scaleTypeValue as (typeof validScaleTypes)[number])
				: "null";

			// Payload 생성
			const payload = {
				productName: data.productName,
				description: data.description,
				price: data.licenseInfo[0]?.price || 0,
				category: data.category,
				genres: data.genres,
				tags: data.tags || [],
				minBpm:
					data.bpmType === "exact" ? data.exactBPM || data.minBpm || 100 : data.bpmRange?.min || data.minBpm || 100,
				maxBpm:
					data.bpmType === "exact" ? data.exactBPM || data.maxBpm || 120 : data.bpmRange?.max || data.maxBpm || 120,
				musicKey: validatedMusicKey,
				scaleType: validatedScaleType,
				licenseInfo: data.licenseInfo,
				currency: data.currency || "KRW",
				coverImageFileId: data.uploadedFileIds.coverImageFileId || data.coverImageFileId,
				audioFileFileId: data.uploadedFileIds.audioFileFileId || data.audioFileFileId,
				zipFileId: data.uploadedFileIds.zipFileId,
				isFreeDownload: data.isFreeDownload || 0,
				isPublic: data.isPublic || 1,
			};

			// 개발 환경에서만 로그 출력
			if (process.env.NODE_ENV === "development") {
				console.log("Form Data:", data);
				console.log("Payload:", payload);
			}

			// 모드에 따라 다른 API 호출
			if (mode === "upload") {
				createProduct(payload, {
					onSuccess: () => {
						onClose();
						openCompleteModal();
					},
					onError: (error) => {
						if (process.env.NODE_ENV === "development") {
							console.error("제품 생성 실패:", error);
						}
						setError("root", {
							type: "manual",
							message: "제품 생성에 실패했습니다.",
						});
					},
				});
			} else {
				updateProduct(payload, {
					onSuccess: () => {
						onClose();
						openCompleteModal();
					},
					onError: (error) => {
						if (process.env.NODE_ENV === "development") {
							console.error("제품 수정 실패:", error);
						}
						setError("root", {
							type: "manual",
							message: "제품 수정에 실패했습니다.",
						});
					},
				});
			}
		},
		[mode, createProduct, updateProduct, onClose, openCompleteModal, setError],
	);

	// 카테고리 변경
	const onChangeCategory = useCallback(
		(category: "BEAT" | "ACAPELA") => {
			setValue("category", category);
			trigger("category");
		},
		[setValue, trigger],
	);

	// BPM 관련 핸들러들
	const onChangeExactBPM = useCallback(
		(bpm: number) => {
			if (isNaN(bpm)) return;
			setValue("exactBPM", bpm === 0 ? undefined : bpm);
			trigger("exactBPM");
		},
		[setValue, trigger],
	);

	const onChangeBPMRange = useCallback(
		(type: "min" | "max", bpm: number) => {
			if (isNaN(bpm)) return;
			const currentRange = getValues("bpmRange") || {};

			if (type === "min") {
				setValue("bpmRange", {
					...currentRange,
					min: bpm === 0 ? undefined : bpm,
				});
			} else {
				setValue("bpmRange", {
					...currentRange,
					max: bpm === 0 ? undefined : bpm,
				});
			}
			trigger("bpmRange");
		},
		[setValue, trigger, getValues],
	);

	const onChangeBPMType = useCallback(
		(type: "exact" | "range") => {
			setValue("bpmType", type);
			trigger("bpmType");
		},
		[setValue, trigger],
	);

	// Key 관련 핸들러들
	const onChangeKey = useCallback(
		(newKey: KeyValue) => {
			const currentKeyValue = getValues("keyValue");
			if (currentKeyValue?.value !== newKey.value) {
				setValue("scaleValue", null);
			}
			setValue("keyValue", newKey);
			trigger(["keyValue", "scaleValue"]);
		},
		[getValues, setValue, trigger],
	);

	const onChangeScale = useCallback(
		(scale: string) => {
			setValue("scaleValue", scale);
			trigger("scaleValue");
		},
		[setValue, trigger],
	);

	const onClearKey = useCallback(() => {
		setValue("keyValue", undefined);
		setValue("scaleValue", null);
		trigger(["keyValue", "scaleValue"]);
	}, [setValue, trigger]);

	const onClearBPM = useCallback(() => {
		setValue("exactBPM", undefined);
		setValue("bpmRange", { min: undefined, max: undefined });
		trigger(["exactBPM", "bpmRange"]);
	}, [setValue, trigger]);

	// 라이센스 관련 핸들러들
	const addLicense = useCallback(() => {
		const currentLicenses = getValues("licenseInfo");
		setValue("licenseInfo", [...currentLicenses, { type: "MASTER", price: 0 }]);
		trigger("licenseInfo");
	}, [getValues, setValue, trigger]);

	const removeLicense = useCallback(
		(index: number) => {
			const currentLicenses = getValues("licenseInfo");
			if (currentLicenses.length > 1) {
				setValue(
					"licenseInfo",
					currentLicenses.filter((_, i) => i !== index),
				);
				trigger("licenseInfo");
			}
		},
		[getValues, setValue, trigger],
	);

	const updateLicense = useCallback(
		(index: number, field: "type" | "price", value: string | number) => {
			const currentLicenses = getValues("licenseInfo");
			const updatedLicenses = [...currentLicenses];
			const currentLicense = updatedLicenses[index];

			if (!currentLicense) return;

			if (field === "price") {
				updatedLicenses[index] = {
					type: currentLicense.type,
					price: Number(value) || 0,
				};
			} else {
				const validType = value === "MASTER" || value === "EXCLUSIVE" ? value : "MASTER";
				updatedLicenses[index] = {
					type: validType,
					price: currentLicense.price,
				};
			}
			setValue("licenseInfo", updatedLicenses);
			trigger("licenseInfo");
		},
		[getValues, setValue, trigger],
	);

	// 커버 이미지 소스
	const coverImageSrc = useMemo(() => {
		return watchedUploadedFiles?.coverImage ? URL.createObjectURL(watchedUploadedFiles.coverImage) : blankCdImage;
	}, [watchedUploadedFiles?.coverImage]);

	return (
		<Popup
			open={isModalOpen}
			onOpenChange={onClose}
		>
			<PopupContent
				className={cn(
					"max-w-[649px] pb-6 transition-all duration-200",
					watchedIsDragOver && "ring-2 ring-hbc-red ring-opacity-50",
				)}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				<PopupHeader>
					<PopupTitle>{modalTitle}</PopupTitle>
				</PopupHeader>

				{/* 드래그 오버레이 */}
				{watchedIsDragOver && (
					<div className="absolute inset-0 bg-hbc-red bg-opacity-10 border-2 border-dashed border-hbc-red rounded-lg flex items-center justify-center z-50">
						<div className="text-hbc-red font-bold text-lg">파일을 여기에 드롭하세요</div>
					</div>
				)}

				<form onSubmit={handleSubmit(onSubmit)}>
					<section className="grid grid-cols-2 gap-6">
						<div className="flex flex-col gap-10">
							{/* 이미지 업로드 섹션 */}
							<div className="flex flex-col justify-center items-center gap-[10px]">
								<AlbumAvatar
									src={coverImageSrc}
									alt="앨범 사진"
								/>
								<div className="flex flex-col gap-1">
									<div className="flex items-center justify-center">
										<input
											type="file"
											accept="image/*"
											onClick={(e) => {
												(e.target as HTMLInputElement).value = "";
											}}
											onChange={(e) => {
												if (e.target.files && e.target.files.length > 0) {
													handleFileInputChange(e, ENUM_FILE_TYPE.PRODUCT_COVER_IMAGE);
												}
											}}
											className="hidden"
											id="image-upload"
										/>
										<label
											htmlFor="image-upload"
											className="cursor-pointer"
											onClick={(e) => {
												e.preventDefault();
												document.getElementById("image-upload")?.click();
											}}
										>
											<Button
												rounded={"full"}
												size={"sm"}
												type="button"
											>
												이미지 업로드
											</Button>
										</label>
									</div>
									{watchedUploadedFiles?.coverImage && (
										<div className="flex items-center justify-center gap-1">
											<Circle />
											<span className="text-[#3884FF] text-sm font-extrabold">
												{watchedUploadedFiles.coverImage.name}
											</span>
										</div>
									)}
									{errors.uploadedFiles?.coverImage && (
										<div className="flex items-center gap-1">
											<div className="rotate-45">
												<Plus stroke="red" />
											</div>
											<span className="text-hbc-red font-[SUIT] text-md font-extrabold leading-[150%] tracking-[0.12px]">
												{errors.uploadedFiles.coverImage.message}
											</span>
										</div>
									)}
								</div>
							</div>

							{/* MP3 파일 업로드 섹션 */}
							<div className="flex flex-col gap-[10px] justify-center items-center">
								{watchedUploadedFiles?.audioFile ? (
									<Badge
										variant="default"
										className="flex gap-[7px] px-5 py-[14px] rounded-5px bg-[#3884FF]"
									>
										<LargeEqualizer fill="white" />
										<div className="text-white">{watchedUploadedFiles.audioFile.name}</div>
									</Badge>
								) : (
									<Badge
										variant="outline"
										className="flex gap-[7px] px-5 py-[14px] rounded-5px border-dashed"
									>
										<LargeEqualizer />
										<div>
											오디오 파일을
											<br />
											업로드하세요
										</div>
									</Badge>
								)}
								<div>
									<input
										type="file"
										accept="audio/*"
										onChange={(e) => handleFileInputChange(e, ENUM_FILE_TYPE.PRODUCT_AUDIO_FILE)}
										className="hidden"
										id="audio-upload"
									/>
									<label
										htmlFor="audio-upload"
										className="cursor-pointer"
										onClick={(e) => {
											e.preventDefault();
											document.getElementById("audio-upload")?.click();
										}}
									>
										<Button
											rounded={"full"}
											size={"sm"}
											type="button"
										>
											MP3 파일 업로드
										</Button>
									</label>
								</div>
								{errors.uploadedFiles?.audioFile && (
									<div className="text-hbc-red font-semibold leading-[150%] tracking-[0.12px]">
										{errors.uploadedFiles.audioFile.message}
									</div>
								)}
								{watchedUploadedFiles?.audioFile && (
									<div className="flex items-center justify-center gap-1">
										<Circle />
										<span className="text-[#3884FF] text-sm font-extrabold">완료 !</span>
									</div>
								)}
							</div>

							{/* 압축 파일 업로드 섹션 */}
							<div className="flex flex-col gap-[10px] justify-center items-center">
								{watchedUploadedFiles?.zipFile ? (
									<Badge
										variant="default"
										className="flex gap-[7px] px-5 py-[14px] rounded-5px bg-[#3884FF]"
									>
										<LargeEqualizer fill="white" />
										<div className="text-white">{watchedUploadedFiles.zipFile.name}</div>
									</Badge>
								) : (
									<Badge
										variant="outline"
										className="flex gap-[7px] px-5 py-[14px] rounded-5px border-dashed"
									>
										<LargeEqualizer />
										<div>
											압축 파일을
											<br />
											업로드하세요
										</div>
									</Badge>
								)}
								<div>
									<input
										type="file"
										accept=".zip,.rar,.7z"
										onChange={(e) => handleFileInputChange(e, ENUM_FILE_TYPE.PRODUCT_ZIP_FILE)}
										className="hidden"
										id="zip-upload"
									/>
									<label
										htmlFor="zip-upload"
										className="cursor-pointer"
										onClick={(e) => {
											e.preventDefault();
											document.getElementById("zip-upload")?.click();
										}}
									>
										<Button
											rounded={"full"}
											size={"sm"}
											type="button"
										>
											압축 파일 업로드
										</Button>
									</label>
								</div>
								{errors.uploadedFiles?.zipFile && (
									<div className="text-hbc-red font-semibold leading-[150%] tracking-[0.12px]">
										{errors.uploadedFiles.zipFile.message}
									</div>
								)}
								{watchedUploadedFiles?.zipFile && (
									<div className="flex items-center justify-center gap-1">
										<Circle />
										<span className="text-[#3884FF] text-sm font-extrabold">완료 !</span>
									</div>
								)}
							</div>
						</div>

						{/* 오른쪽 부분 - 기존 폼 필드들 */}
						<div className="flex flex-col gap-2.5">
							{/* 제목 입력 */}
							<div className="flex flex-col gap-[5px]">
								<div className="font-[SUIT] text-xs flex justify-between">
									<div className="text-black font-extrabold leading-[160%] tracking-[-0.24px]">제목</div>
									{errors.productName && (
										<div className="text-hbc-red font-semibold leading-[150%] tracking-[0.12px]">
											{errors.productName.message}
										</div>
									)}
								</div>
								<Controller
									name="productName"
									control={control}
									render={({ field }) => (
										<Input
											variant={"rounded"}
											{...field}
											className={errors.productName ? "border-red-500" : ""}
										/>
									)}
								/>
							</div>

							{/* 곡 설명/가사 입력 */}
							<div className="flex flex-col gap-[5px]">
								<div className="font-[SUIT] text-xs flex justify-between">
									<div className="text-black font-extrabold leading-[160%] tracking-[-0.24px]">곡 설명 / 가사</div>
									{errors.description && (
										<div className="text-hbc-red font-semibold leading-[150%] tracking-[0.12px]">
											{errors.description.message}
										</div>
									)}
								</div>
								<Controller
									name="description"
									control={control}
									render={({ field }) => (
										<textarea
											{...field}
											className={cn(
												"border-x-[1px] border-y-[2px] border-black rounded-lg p-2 h-[162px] resize-none text-hbc-black font-suit text-xs font-semibold leading-[160%] tracking-[0.18px] focus:outline-none",
												errors.description && "border-red-500",
											)}
										/>
									)}
								/>
							</div>

							{/* 카테고리 선택 */}
							<div className="flex gap-2 w-full">
								<Button
									size={"md"}
									rounded={"full"}
									className="flex-1 flex items-center justify-center"
									variant={watchedCategory === "BEAT" ? "fill" : "outline"}
									onClick={() => onChangeCategory("BEAT")}
									type="button"
								>
									<Beat
										width="90"
										height="12"
										fill={watchedCategory === "BEAT" ? "white" : "black"}
									/>
								</Button>
								<Button
									size={"md"}
									variant={watchedCategory === "ACAPELA" ? "fill" : "outline"}
									rounded={"full"}
									className="flex-1 flex items-center justify-center"
									onClick={() => onChangeCategory("ACAPELA")}
									type="button"
								>
									<Acapella
										width="90"
										height="12"
										fill={watchedCategory === "ACAPELA" ? "white" : "black"}
									/>
								</Button>
							</div>

							{/* 장르 선택 */}
							<div className="flex flex-col gap-[5px]">
								<div className="font-[SUIT] text-xs flex justify-between">
									<div className="text-black font-extrabold leading-[160%] tracking-[-0.24px]">장르</div>
									{errors.genres && (
										<div className="text-hbc-red font-semibold leading-[150%] tracking-[0.12px]">
											{errors.genres.message}
										</div>
									)}
								</div>
								{/* <div
									className={cn(
										"flex gap-[5px] p-2 border-x-[1px] border-y-[2px] border-black rounded-[5px]",
										errors.genres && "border-red-500",
									)}
								> */}
								<Controller
									name="genres"
									control={control}
									render={({ field }) => (
										<MultiTagGenreInput
											type="genre"
											maxItems={10}
											placeholder="장르를 선택하세요"
											allowDirectInput={false}
											// suggestedItems={genreList?.data.map((genre) => ({ value: genre.name, count: 0 })) || []}
											suggestedItems={[]}
											onChange={field.onChange}
										/>
									)}
								/>
								{/* </div> */}
							</div>

							{/* 태그 선택 */}
							<div className="flex flex-col gap-[5px]">
								<div className="font-[SUIT] text-xs flex justify-between">
									<div className="text-black font-extrabold leading-[160%] tracking-[-0.24px]">태그</div>
									{errors.tags && (
										<div className="text-hbc-red font-semibold leading-[150%] tracking-[0.12px]">
											{errors.tags.message}
										</div>
									)}
								</div>
								<Controller
									name="tags"
									control={control}
									render={({ field }) => (
										<MultiTagGenreInput
											type="tag"
											maxItems={10}
											placeholder="태그를 입력하세요"
											allowDirectInput={true}
											suggestedItems={tagList?.data.map((tag) => ({ value: tag.name, count: 0 })) || []}
											onChange={field.onChange}
										/>
									)}
								/>
							</div>

							{/* BPM 설정 */}
							<div className="flex flex-col gap-[5px]">
								<div className="font-[SUIT] text-xs flex justify-between">
									<div className="text-black font-extrabold leading-[160%] tracking-[-0.24px]">BPM</div>
								</div>
								<Controller
									name="bpmType"
									control={control}
									render={({ field: bpmTypeField }) => (
										<Controller
											name="exactBPM"
											control={control}
											render={({ field: exactBPMField }) => (
												<Controller
													name="bpmRange"
													control={control}
													render={({ field: bpmRangeField }) => (
														<BPMDropdown
															bpmType={bpmTypeField.value}
															bpmValue={exactBPMField.value}
															bpmRangeValue={bpmRangeField.value}
															onChangeBPMType={onChangeBPMType}
															onChangeExactBPM={onChangeExactBPM}
															onChangeBPMRange={onChangeBPMRange}
															onClear={onClearBPM}
														/>
													)}
												/>
											)}
										/>
									)}
								/>
							</div>

							{/* Key 설정 (BEAT일 때만) */}
							{watchedCategory === "BEAT" && (
								<div className="flex flex-col gap-[5px]">
									<div className="font-[SUIT] text-xs flex justify-between">
										<div className="text-black font-extrabold leading-[160%] tracking-[-0.24px]">Key</div>
									</div>
									<Controller
										name="keyValue"
										control={control}
										render={({ field: keyValueField }) => (
											<Controller
												name="scaleValue"
												control={control}
												render={({ field: scaleValueField }) => (
													<KeyDropdown
														keyValue={keyValueField.value}
														scaleValue={scaleValueField.value || null}
														onChangeKey={onChangeKey}
														onChangeScale={onChangeScale}
														onClear={onClearKey}
													/>
												)}
											/>
										)}
									/>
								</div>
							)}

							{/* 라이센스 설정 */}
							<div className="flex flex-col gap-[5px]">
								<div className="font-[SUIT] text-xs flex justify-between">
									<div className="text-black font-extrabold leading-[160%] tracking-[-0.24px]">License</div>
									<div className="text-hbc-red font-semibold leading-[150%] tracking-[0.12px]">
										필수 입력사항 입니다.
									</div>
								</div>
								{watchedLicenseInfo?.map((license, index) => (
									<div
										key={index}
										className="flex gap-5 items-center"
									>
										<div className="flex-grow grid grid-cols-2 gap-[5px]">
											<Input
												variant="rounded"
												value={license.type}
												onChange={(e) => updateLicense(index, "type", e.target.value)}
												placeholder="라이센스 타입"
											/>
											<div className="relative">
												<Input
													variant="rounded"
													type="number"
													value={license.price}
													onChange={(e) => updateLicense(index, "price", e.target.value)}
													placeholder="가격"
												/>
												<span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-semibold tracking-[-0.24px] text-gray-400">
													KRW
												</span>
											</div>
										</div>
										<button
											type="button"
											className="flex-shrink-0 cursor-pointer"
											onClick={() => removeLicense(index)}
										>
											<MinusCircle />
										</button>
									</div>
								))}
								{errors.licenseInfo && <span className="text-red-500 text-xs">{errors.licenseInfo.message}</span>}

								<button
									type="button"
									className="flex justify-center cursor-pointer"
									onClick={addLicense}
								>
									<AddCircle />
								</button>
							</div>

							{/* 공개여부 */}
							<div className="flex flex-col gap-[5px]">
								<div className="font-[SUIT] text-xs flex justify-between">
									<div className="text-black font-extrabold leading-[160%] tracking-[-0.24px]">공개여부</div>
								</div>
								<div className="grid grid-cols-2">
									<Controller
										name="isPublic"
										control={control}
										render={({ field }) => (
											<Dropdown
												className="w-full"
												buttonClassName="border-x-1px border-y-2px"
												defaultValue={field.value === 1 ? "공개" : "비공개"}
												options={[
													{ label: "공개", value: "공개" },
													{ label: "비공개", value: "비공개" },
												]}
												onChange={(value: string) => {
													field.onChange(value === "공개" ? 1 : 0);
													trigger("isPublic");
												}}
											/>
										)}
									/>
								</div>
							</div>

							{/* Free Download 체크박스 */}
							<div className="w-full flex justify-end gap-1">
								<Controller
									name="isFreeDownload"
									control={control}
									render={({ field }) => (
										<input
											id="free-download-checkbox"
											type="checkbox"
											checked={field.value === 1}
											onChange={(e) => {
												field.onChange(e.target.checked ? 1 : 0);
												trigger("isFreeDownload");
											}}
										/>
									)}
								/>
								<label
									htmlFor="free-download-checkbox"
									className="select-none text-[#000] font-[Suisse Int'l] text-[12px] font-semibold leading-normal tracking-[0.12px]"
								>
									Free DownLoad
								</label>
							</div>

							{/* 루트 에러 표시 */}
							{errors.root && <div className="text-red-500 text-sm font-semibold">{errors.root.message}</div>}
						</div>
					</section>

					<PopupFooter>
						<Button
							onClick={onClose}
							type="button"
							className="bg-white px-2 py-1 text-hbc-gray-200 border-b-2 border-hbc-gray-200 rounded-none font-[Suisse Int'l] text-[24px] font-bold leading-normal tracking-[0.24px]"
						>
							CANCEL
						</Button>
						<Button
							type="submit"
							className="bg-white px-2 py-1 text-hbc-red border-b-2 border-hbc-red rounded-none font-[SUIT] text-[24px] font-extrabold leading-normal tracking-[0.24px]"
							disabled={isProcessing}
						>
							{isProcessing ? loadingText : submitButtonText}
						</Button>
					</PopupFooter>
				</form>
			</PopupContent>
		</Popup>
	);
};

export default ArtistStudioTrackModal;
