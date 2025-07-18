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
import { TrackUploadFormSchema } from "@/features/artist-studio/artist-studio.types";
import { Acapella, AddCircle, Beat, LargeEqualizer, MinusCircle, Plus } from "@/assets/svgs";
import Circle from "@/assets/svgs/Circle";
import { checkIsPureEnglish, cn } from "@/common/utils";
import { AlbumAvatar, Badge, BPMDropdown, Dropdown, Input, KeyDropdown } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { Popup, PopupContent, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import { getProductQueryOption, getProductSearchInfoQueryOption } from "@/apis/product/query/product.query-option";
import { useQuery } from "@tanstack/react-query";
import MultiTagGenreInput from "@/components/ui/MultiTagGenreInput/MultiTagGenreInput";
import blankCdImage from "@/assets/images/blank-cd.png";

export type KeyValue = { label: string; value: string };

type ExtendedTrackFormData = z.infer<typeof TrackUploadFormSchema> & {
	// 필수 검증 추가
	productName: string;
	description: string;
	genres: string[];
	licenseInfo: Array<{
		type: "MASTER" | "EXCLUSIVE";
		price: number;
	}>;
	// 파일 업로드 상태
	uploadedFiles: {
		coverImage: File | null;
		audioFile: File | null;
		zipFile: File | null;
	};
	uploadedFileIds: {
		coverImageFileId?: number;
		audioFileFileId?: number;
		zipFileId?: number;
	};
	// UI 상태
	isDragOver: boolean;
	// Key 관련 UI 필드들
	keyValue?: { label: string; value: string };
	scaleValue: string | null;
};

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
	const { data: searchInfo } = useQuery(getProductSearchInfoQueryOption());

	// 편집 모드에서만 제품 데이터 쿼리
	const { data: productData } = useQuery({
		...getProductQueryOption(productId || 0),
		enabled: mode === "edit" && !!productId,
	});

	const { mutate: createProduct, isPending: isCreating } = useCreateProductMutation();
	const { mutate: updateProduct, isPending: isUpdating } = useUpdateProductMutation(productId || 0);
	const { mutate: uploadProductFile, isPending: isUploading } = useUploadProductFileMutation();

	const isProcessing = isCreating || isUpdating || isUploading;

	// 모드에 따른 동적 스키마 생성
	const formSchema = useMemo(() => {
		const baseSchema = TrackUploadFormSchema.extend({
			// 필수 검증 추가
			productName: z.string().min(1, "필수 입력사항입니다."),
			description: z.string().min(1, "필수 입력사항입니다."),
			genres: z.array(z.string()).min(1, "필수 입력사항입니다."),
			licenseInfo: z
				.array(
					z.object({
						type: z.enum(["MASTER", "EXCLUSIVE"]),
						price: z.number().min(1, "가격을 입력해주세요."),
					}),
				)
				.min(1, "필수 입력사항입니다."),
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
			// Key 관련 UI 필드들
			keyValue: z.object({ label: z.string(), value: z.string() }).optional(),
			scaleValue: z.string().nullable(),
		});

		// 업로드 모드에서만 파일 검증 추가
		if (mode === "upload") {
			return baseSchema.superRefine((data, ctx) => {
				if (!data.uploadedFileIds.coverImageFileId) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: "커버 이미지는 필수입니다.",
						path: ["uploadedFiles", "coverImage"],
					});
				}

				if (!data.uploadedFileIds.audioFileFileId) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: "오디오 파일은 필수입니다.",
						path: ["uploadedFiles", "audioFile"],
					});
				}

				if (!data.uploadedFileIds.zipFileId) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: "압축 파일은 필수입니다.",
						path: ["uploadedFiles", "zipFile"],
					});
				}
			});
		}

		return baseSchema;
	}, [mode]);

	// 모드에 따른 기본값 설정
	const getDefaultValues = useCallback((): ExtendedTrackFormData => {
		const baseDefaults = {
			productName: "",
			description: "",
			// price: 0,
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
			coverImageFileId: undefined,
			audioFileFileId: undefined,
			// UI 전용 필드들
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
			const musicKey = (productData.musicKey as any) || "null";
			const scaleType = (productData.scaleType as any) || "null";

			return {
				...baseDefaults,
				productName: productData.productName,
				description: productData.description,
				category: productData.category,
				// API 응답에서 객체 배열을 문자열 배열로 변환
				genres: productData.genres?.map((genre: any) => genre.name) || [],
				tags: productData.tags?.map((tag: any) => tag.name) || [],
				minBpm: productData.minBpm || 100,
				maxBpm: productData.maxBpm || 120,
				musicKey: musicKey,
				scaleType: scaleType,
				// Key 관련 UI 필드 설정
				keyValue: musicKey !== "null" ? { label: musicKey, value: musicKey } : undefined,
				scaleValue: scaleType !== "null" ? scaleType.toLowerCase() : null,
				// 라이센스 정보 설정 (서버 데이터 우선 사용)
				licenseInfo:
					(productData as any).licenseInfo?.map((license: any) => ({
						type: license.type,
						price: license.price,
					})) || baseDefaults.licenseInfo,
				currency: "KRW",
				coverImageFileId: (productData as any).coverImage?.id || undefined,
				audioFileFileId: (productData as any).audioFile?.id || undefined,
				isFreeDownload: (productData as any).isFreeDownload || 0,
				isPublic: (productData as any).isPublic || 1,
				uploadedFileIds: {
					coverImageFileId: (productData as any).coverImage?.id || undefined,
					audioFileFileId: (productData as any).audioFile?.id || undefined,
					zipFileId: (productData as any).zipFile?.id || undefined,
				},
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
		formState: { errors, isDirty },
		reset,
	} = useForm<ExtendedTrackFormData>({
		resolver: zodResolver(formSchema),
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

	// productData에서 Genre 객체 배열 생성
	const initialGenres = useMemo(() => {
		if (mode === "edit" && productData?.genres) {
			return productData.genres.map((genre: any) => ({
				id: genre.id,
				text: genre.name,
				isFromDropdown: true,
			}));
		}
		return [];
	}, [mode, productData?.genres]);

	// productData에서 Tag 객체 배열 생성
	const initialTags = useMemo(() => {
		if (mode === "edit" && productData?.tags) {
			return productData.tags.map((tag: any) => ({
				id: tag.id,
				text: tag.name,
				isFromDropdown: true,
			}));
		}
		return [];
	}, [mode, productData?.tags]);

	// 모달이 열릴 때 폼 초기화
	useEffect(() => {
		if (isModalOpen) {
			const defaultValues = getDefaultValues();
			reset(defaultValues);
		}
	}, [isModalOpen, mode, productData, reset, getDefaultValues]);

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
				// price: data.licenseInfo[0]?.price || 0,
				category: data.category,
				genres: data.genres,
				tags: data.tags || [],
				minBpm: data.minBpm || 100,
				maxBpm: data.maxBpm || 120,
				musicKey: validatedMusicKey,
				scaleType: validatedScaleType,
				licenseInfo: data.licenseInfo,
				currency: data.currency || "KRW",
				coverImageFileId:
					data.uploadedFileIds.coverImageFileId ||
					data.coverImageFileId ||
					(productData?.coverImage || {}).id ||
					undefined,
				audioFileFileId:
					data.uploadedFileIds.audioFileFileId ||
					data.audioFileFileId ||
					(productData?.audioFile || {}).id ||
					undefined,
				zipFileId: data.uploadedFileIds.zipFileId || data.zipFileId || (productData?.zipFile || {}).id || undefined,
				isFreeDownload: data.isFreeDownload ?? 0,
				isPublic: data.isPublic ?? 1,
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
		[mode, createProduct, updateProduct, onClose, openCompleteModal, setError, productData],
	);

	// 카테고리 변경
	const onChangeCategory = useCallback(
		(category: "BEAT" | "ACAPELA") => {
			setValue("category", category);
			trigger("category");
		},
		[setValue, trigger],
	);

	// BPM 관련 핸들러들 - onSubmit 방식으로 변경
	const onSubmitBPM = useCallback(
		(minBpm: number | undefined, maxBpm: number | undefined) => {
			setValue("minBpm", minBpm || 100);
			setValue("maxBpm", maxBpm || 120);
			trigger(["minBpm", "maxBpm"]);
		},
		[setValue, trigger],
	);

	// 호환성을 위한 더미 핸들러들
	const onChangeMinBpm = useCallback(() => {}, []);
	const onChangeMaxBpm = useCallback(() => {}, []);

	const onClearBPM = useCallback(() => {
		setValue("minBpm", 100);
		setValue("maxBpm", 120);
		trigger(["minBpm", "maxBpm"]);
	}, [setValue, trigger]);

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

	// 파일 상태 가져오기
	const getFileInfo = useCallback(
		(fileType: "coverImage" | "audioFile" | "zipFile") => {
			const uploadedFile = watchedUploadedFiles?.[fileType];
			const existingFile = productData?.[fileType];

			return {
				displayName: uploadedFile?.name || existingFile?.originName,
				isCompleted: !!uploadedFile || (mode === "edit" && !!existingFile),
			};
		},
		[watchedUploadedFiles, productData, mode],
	);

	const coverImageFileInfo = getFileInfo("coverImage");
	const audioFileFileInfo = getFileInfo("audioFile");
	const zipFileFileInfo = getFileInfo("zipFile");

	// 커버 이미지 소스
	const coverImageSrc = useMemo(() => {
		// 새로 업로드된 파일이 있으면 우선 사용
		if (watchedUploadedFiles?.coverImage) {
			return URL.createObjectURL(watchedUploadedFiles.coverImage);
		}
		// 편집 모드에서 기존 파일이 있으면 사용
		if (mode === "edit" && productData?.coverImage?.url) {
			return productData.coverImage.url;
		}
		// 기본 이미지
		return blankCdImage;
	}, [watchedUploadedFiles?.coverImage, mode, productData?.coverImage?.url]);

	// 바깥 클릭 시 모달 닫기 제어
	const handleOpenChange = useCallback(
		(open: boolean) => {
			// 모달을 닫으려고 할 때 (open === false)
			if (!open) {
				// 폼이 수정되지 않았거나 이미 처리 중이면 바로 닫기
				if (!isDirty || isProcessing) {
					onClose();
					return;
				}
				// 폼이 수정되었으면 확인 후 닫기
				const shouldClose = window.confirm("작성 중인 내용이 있습니다. 정말 닫으시겠습니까?");
				if (shouldClose) {
					onClose();
				}
			}
		},
		[isDirty, isProcessing, onClose],
	);

	return (
		<Popup
			open={isModalOpen}
			onOpenChange={handleOpenChange}
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
									{coverImageFileInfo.displayName && (
										<div className="flex items-center justify-center gap-1">
											<div className="flex-shrink-0">
												<Circle />
											</div>
											<span className="text-[#3884FF] text-sm font-extrabold break-all">
												{coverImageFileInfo.displayName}
											</span>
										</div>
									)}
									{errors.uploadedFiles?.coverImage && (
										<div className="flex items-center gap-1">
											<div className="rotate-45">
												<Plus stroke="red" />
											</div>
											<span
												className={cn(
													"text-hbc-red text-md font-extrabold leading-[150%] tracking-[0.12px]",
													"font-suit",
													checkIsPureEnglish(errors.uploadedFiles.coverImage.message) && "font-suisse",
												)}
											>
												{errors.uploadedFiles.coverImage.message}
											</span>
										</div>
									)}
								</div>
							</div>

							{/* MP3 파일 업로드 섹션 */}
							<div className="flex flex-col gap-[10px] justify-center items-center">
								{audioFileFileInfo.displayName ? (
									<Badge
										variant="default"
										className="flex gap-[7px] px-5 py-[14px] rounded-5px bg-[#3884FF]"
									>
										<LargeEqualizer fill="white" />
										<div className="text-white">{audioFileFileInfo.displayName}</div>
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
								{audioFileFileInfo.isCompleted && (
									<div className="flex items-center justify-center gap-1">
										<Circle />
										<span className="text-[#3884FF] text-sm font-extrabold">완료 !</span>
									</div>
								)}
							</div>

							{/* 압축 파일 업로드 섹션 */}
							<div className="flex flex-col gap-[10px] justify-center items-center">
								{zipFileFileInfo.displayName ? (
									<Badge
										variant="default"
										className="flex gap-[7px] px-5 py-[14px] rounded-5px bg-[#3884FF]"
									>
										<LargeEqualizer fill="white" />
										<div className="text-white">{zipFileFileInfo.displayName}</div>
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
								{zipFileFileInfo.isCompleted && (
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
								<div className="font-suit text-xs flex justify-between">
									<div className="text-black font-extrabold leading-[160%] tracking-[-0.24px]">제목</div>
									{errors.productName && (
										<div
											className={cn(
												"text-hbc-red font-semibold leading-[150%] tracking-[0.12px]",
												checkIsPureEnglish(errors.productName.message) && "font-suisse",
											)}
										>
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
										/>
									)}
								/>
							</div>

							{/* 곡 설명/가사 입력 */}
							<div className="flex flex-col gap-[5px]">
								<div className="font-suit text-xs flex justify-between">
									<div className="text-black font-extrabold leading-[160%] tracking-[-0.24px]">곡 설명 / 가사</div>
									{errors.description && (
										<div
											className={cn(
												"text-hbc-red font-semibold leading-[150%] tracking-[0.12px]",
												checkIsPureEnglish(errors.description.message) && "font-suisse",
											)}
										>
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
								<div className="font-suit text-xs flex justify-between">
									<div className="text-black font-extrabold leading-[160%] tracking-[-0.24px]">장르</div>
									{errors.genres && (
										<div
											className={cn(
												"text-hbc-red font-semibold leading-[150%] tracking-[0.12px]",
												checkIsPureEnglish(errors.genres.message) && "font-suisse",
											)}
										>
											{errors.genres.message}
										</div>
									)}
								</div>
								<Controller
									name="genres"
									control={control}
									render={({ field }) => (
										<MultiTagGenreInput
											type="genre"
											maxItems={10}
											placeholder="장르를 선택하세요"
											allowDirectInput={false}
											suggestedItems={
												searchInfo?.genres?.map((genre) => ({ id: genre.id, value: genre.name, count: genre.count })) ||
												[]
											}
											initialItems={initialGenres}
											onChange={(items) => {
												// 객체 배열을 문자열 배열로 변환
												const stringArray = items.map((item: any) =>
													typeof item === "string" ? item : item.text || item.value || item,
												);
												field.onChange(stringArray);
											}}
										/>
									)}
								/>
							</div>

							{/* 태그 선택 */}
							<div className="flex flex-col gap-[5px]">
								<div className="font-suit text-xs flex justify-between">
									<div className="text-black font-extrabold leading-[160%] tracking-[-0.24px]">태그</div>
									{errors.tags && (
										<div
											className={cn(
												"text-hbc-red font-semibold leading-[150%] tracking-[0.12px]",
												checkIsPureEnglish(errors.tags.message) && "font-suisse",
											)}
										>
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
											suggestedItems={
												searchInfo?.tags?.map((tag) => ({ id: tag.id, value: tag.name, count: tag.count })) || []
											}
											initialItems={initialTags}
											onChange={(items) => {
												// 객체 배열을 문자열 배열로 변환
												const stringArray = items.map((item: any) =>
													typeof item === "string" ? item : item.text || item.value || item,
												);
												field.onChange(stringArray);
											}}
										/>
									)}
								/>
							</div>

							{/* BPM 설정 - 단순화 */}
							<div className="flex flex-col gap-[5px]">
								<div className="font-suisse text-xs flex justify-between">
									<div className="text-black font-extrabold leading-[160%] tracking-[-0.24px]">BPM</div>
								</div>
								<Controller
									name="minBpm"
									control={control}
									render={({ field: minField }) => (
										<Controller
											name="maxBpm"
											control={control}
											render={({ field: maxField }) => (
												<BPMDropdown
													minBpm={minField.value}
													maxBpm={maxField.value}
													onChangeMinBpm={onChangeMinBpm}
													onChangeMaxBpm={onChangeMaxBpm}
													onClear={onClearBPM}
													onSubmit={onSubmitBPM}
												/>
											)}
										/>
									)}
								/>
							</div>

							{/* Key 설정 (BEAT일 때만) */}
							{watchedCategory === "BEAT" && (
								<div className="flex flex-col gap-[5px]">
									<div className="font-suisse text-xs flex justify-between">
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
								<div className="font-suit text-xs flex justify-between">
									<div className="text-black font-extrabold leading-[160%] tracking-[-0.24px]">License</div>
									{errors.licenseInfo && (
										<div className="text-hbc-red font-semibold leading-[150%] tracking-[0.12px]">
											{errors.licenseInfo.message}
										</div>
									)}
								</div>
								{watchedLicenseInfo?.map((license, index) => (
									<div
										key={index}
										className="flex gap-5"
									>
										<div className="flex-grow grid grid-cols-2 gap-[5px]">
											<Input
												variant="rounded"
												value={license.type}
												readOnly
												onChange={(e) => updateLicense(index, "type", e.target.value)}
												placeholder="라이센스 타입"
											/>
											<div className="flex flex-col gap-1">
												<div className="flex gap-2 items-center">
													<div className="flex-1 relative">
														<Input
															variant="rounded"
															type="text"
															inputMode="numeric"
															pattern="[0-9]*"
															value={license.price || ""}
															onChange={(e) => updateLicense(index, "price", e.target.value)}
															placeholder="가격"
															className={errors.licenseInfo?.[index]?.price ? "border-red-500" : ""}
														/>
														<span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-semibold tracking-[-0.24px] text-gray-400">
															KRW
														</span>
													</div>
													<button
														type="button"
														className="flex-shrink-0 flex items-center justify-center cursor-pointer"
														onClick={() => removeLicense(index)}
													>
														<MinusCircle />
													</button>
												</div>
												{errors.licenseInfo?.[index]?.price && (
													<div className="text-hbc-red text-xs leading-tight">
														{errors.licenseInfo[index]?.price?.message}
													</div>
												)}
											</div>
										</div>
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
								<div className="font-suit text-xs flex justify-between">
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
												value={field.value === 1 ? "공개" : "비공개"}
												options={[
													{ label: "공개", value: "공개" },
													{ label: "비공개", value: "비공개" },
												]}
												onChange={(value: string) => {
													console.log(value);
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
									className="select-none text-[#000] font-suisse text-[12px] font-semibold leading-normal tracking-[0.12px]"
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
							className="bg-white px-2 py-1 text-hbc-gray-200 border-b-2 border-hbc-gray-200 rounded-none font-suisse text-[24px] font-bold leading-normal tracking-[0.24px]"
						>
							CANCEL
						</Button>
						<Button
							type="submit"
							className="bg-white px-2 py-1 text-hbc-red border-b-2 border-hbc-red rounded-none font-suit text-[24px] font-extrabold leading-normal tracking-[0.24px]"
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
