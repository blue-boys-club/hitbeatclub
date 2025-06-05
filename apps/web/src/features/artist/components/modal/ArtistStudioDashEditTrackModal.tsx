"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useUpdateProductMutation } from "@/apis/product/mutations";
import { Acapella, AddCircle, Beat, LargeEqualizer, MinusCircle, Plus } from "@/assets/svgs";
import Circle from "@/assets/svgs/Circle";
import { cn } from "@/common/utils";
import { AlbumAvatar, Badge, BPMDropdown, Dropdown, Input, KeyDropdown } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { GenreButton } from "@/components/ui/GenreButton";
import { Popup, PopupButton, PopupContent, PopupFooter, PopupHeader, PopupTitle } from "@/components/ui/Popup";
import { TagButton } from "@/components/ui/TagButton";
import { ProductUpdateRequest } from "@hitbeatclub/shared-types/product";

export type BPM = number | undefined;
export type BPMRange = { min?: number | undefined; max?: number | undefined } | undefined;
export type KeyValue = { label: string; value: string };

// Zod 스키마 정의
const trackFormSchema = z.object({
	title: z.string().min(1, "제목을 입력해주세요."),
	description: z.string().min(1, "곡 설명/가사를 입력해주세요."),
	category: z.enum(["BEAT", "ACAPELLA"]),
	genres: z.array(z.string()).min(1, "최소 1개의 장르를 선택해주세요."),
	tags: z.array(z.string()).min(1, "최소 1개의 태그를 선택해주세요."),
	bpmType: z.enum(["exact", "range"]),
	exactBPM: z.number().optional(),
	bpmRange: z
		.object({
			min: z.number().optional(),
			max: z.number().optional(),
		})
		.optional(),
	keyValue: z
		.object({
			label: z.string(),
			value: z.string(),
		})
		.optional(),
	scaleValue: z.string().nullable().optional(),
	licenses: z
		.array(
			z.object({
				type: z.string(),
				price: z.number().min(0, "가격은 0 이상이어야 합니다."),
			}),
		)
		.min(1, "최소 1개의 라이센스를 설정해주세요."),
	isPublic: z.boolean(),
	isFreeDownload: z.boolean(),
});

type TrackFormData = z.infer<typeof trackFormSchema>;

interface ArtistStudioDashEditTrackModalProps {
	isModalOpen: boolean;
	onClose: () => void;
	openCompleteModal: () => void;
}

const ArtistStudioDashEditTrackModal = ({
	isModalOpen,
	onClose,
	openCompleteModal,
}: ArtistStudioDashEditTrackModalProps) => {
	const { mutate: updateProduct } = useUpdateProductMutation(1);

	// react-hook-form 설정
	const {
		control,
		handleSubmit,
		watch,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<TrackFormData>({
		resolver: zodResolver(trackFormSchema),
		defaultValues: {
			title: "",
			description: "",
			category: "BEAT",
			genres: ["Hip-hop", "G-funk"], // 기본값
			tags: ["Hip-hop", "G-funk"], // 기본값
			bpmType: "exact",
			exactBPM: undefined,
			bpmRange: { min: undefined, max: undefined },
			keyValue: undefined,
			scaleValue: null,
			licenses: [
				{ type: "MASTER", price: 10000 },
				{ type: "EXCLUSIVE", price: 20000 },
			],
			isPublic: true,
			isFreeDownload: false,
		},
	});

	// 폼 값 감시
	const watchedCategory = watch("category");
	const watchedBpmType = watch("bpmType");
	const watchedKeyValue = watch("keyValue");
	const watchedScaleValue = watch("scaleValue");
	const watchedLicenses = watch("licenses");

	const onSubmit = (data: TrackFormData) => {
		let payload = {
			productName: data.title,
			description: data.description,
			price: data.licenses[0]?.price || 0,
			category: data.category,
			genres: data.genres,
			tags: data.tags,
			minBpm: 0,
			maxBpm: 0,
			musicKey: data.keyValue?.value,
			scaleType: data.scaleValue ? data.scaleValue.toUpperCase() : null,
			licenseInfo: data.licenses.map((license) => ({
				type: license.type,
				price: license.price,
			})),
			currency: "KRW",
			coverImageFileId: 1,
			audioFileFileId: 2,
			zipFileId: 3,
			isFreeDownload: data.isFreeDownload ? 1 : 0,
			isPublic: data.isPublic ? 1 : 0,
		};

		if (data.bpmType === "exact") {
			payload.minBpm = data.exactBPM ?? 0;
			payload.maxBpm = data.exactBPM ?? 0;
		} else {
			payload.minBpm = data.bpmRange?.min ?? 0;
			payload.maxBpm = data.bpmRange?.max ?? 0;
		}

		// updateProduct(payload, {
		// 	onSuccess: () => {
		// 		onClose();
		// 		openCompleteModal();
		// 	},
		// });
		console.log("Form Data:", data);
		console.log("Payload:", payload);
	};

	const onChangeCategory = (category: "BEAT" | "ACAPELLA") => {
		setValue("category", category);
	};

	const onChangeExactBPM = (bpm: number) => {
		if (isNaN(bpm)) return;
		setValue("exactBPM", bpm === 0 ? undefined : bpm);
	};

	const onChangeBPMRange = (type: "min" | "max", bpm: number) => {
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
	};

	const onChangeBPMType = (type: "exact" | "range") => {
		setValue("bpmType", type);
	};

	const onChangeKey = (newKey: KeyValue) => {
		if (watchedKeyValue?.value !== newKey.value) {
			setValue("scaleValue", null);
		}
		setValue("keyValue", newKey);
	};

	const onChangeScale = (scale: string) => {
		setValue("scaleValue", scale);
	};

	const onClearKey = () => {
		setValue("keyValue", undefined);
		setValue("scaleValue", null);
	};

	const onClearBPM = () => {
		setValue("exactBPM", undefined);
		setValue("bpmRange", { min: undefined, max: undefined });
	};

	// 라이센스 추가
	const addLicense = () => {
		const currentLicenses = getValues("licenses");
		setValue("licenses", [...currentLicenses, { type: "", price: 0 }]);
	};

	// 라이센스 제거
	const removeLicense = (index: number) => {
		const currentLicenses = getValues("licenses");
		if (currentLicenses.length > 1) {
			setValue(
				"licenses",
				currentLicenses.filter((_, i) => i !== index),
			);
		}
	};

	// 라이센스 업데이트
	const updateLicense = (index: number, field: "type" | "price", value: string | number) => {
		const currentLicenses = getValues("licenses");
		const updatedLicenses = [...currentLicenses];
		const currentLicense = updatedLicenses[index];

		if (!currentLicense) return;

		if (field === "price") {
			updatedLicenses[index] = {
				type: currentLicense.type,
				price: Number(value) || 0,
			};
		} else {
			updatedLicenses[index] = {
				type: String(value) || "",
				price: currentLicense.price,
			};
		}
		setValue("licenses", updatedLicenses);
	};

	return (
		<Popup
			open={isModalOpen}
			onOpenChange={onClose}
		>
			<PopupContent className="max-w-[649px] pb-6">
				<PopupHeader>
					<PopupTitle>트랙 수정</PopupTitle>
				</PopupHeader>
				<form onSubmit={handleSubmit(onSubmit)}>
					<section className="grid grid-cols-2 gap-6">
						<div className="flex flex-col gap-10">
							{/* 이미지 업로드 섹션 */}
							<div className="flex flex-col justify-center items-center gap-[10px]">
								<AlbumAvatar
									src="/"
									alt="앨범 사진"
								/>
								<div className="flex flex-col gap-1">
									<div className="flex items-center justify-center">
										<Button
											rounded={"full"}
											size={"sm"}
											type="button"
										>
											이미지 업로드
										</Button>
									</div>
									<div className={cn("invisible", "flex items-center gap-1")}>
										<div className="rotate-45">
											<Plus stroke="red" />
										</div>
										<span className="text-hbc-red font-[SUIT] text-md font-extrabold leading-[150%] tracking-[0.12px]">
											사용할 수 없는 파일입니다.
										</span>
									</div>
								</div>
							</div>

							{/* MP3 파일 업로드 섹션 */}
							<div className="flex flex-col gap-[10px] justify-center items-center">
								<Badge
									variant="destructive"
									className="flex gap-[7px] px-5 py-[14px] rounded-5px"
								>
									<LargeEqualizer fill="white" />
									<div>Cheek_to_cheek.mp3</div>
								</Badge>
								<div>
									<Button
										rounded={"full"}
										size={"sm"}
										type="button"
									>
										MP3 파일 업로드
									</Button>
								</div>
								<div className={cn("invisible", "flex items-center justify-center gap-1")}>
									<Circle />
									<span className="text-[#3884FF] text-sm font-extrabold ">완료 !</span>
								</div>
							</div>

							{/* 압축 파일 업로드 섹션 */}
							<div className="flex flex-col gap-[10px] justify-center items-center">
								<Badge
									variant="destructive"
									className="flex gap-[7px] px-5 py-[14px] rounded-5px"
								>
									<LargeEqualizer fill="white" />
									<div>Cheek_to_cheek.zip</div>
								</Badge>
								<div>
									<Button
										rounded={"full"}
										size={"sm"}
										type="button"
									>
										압축 파일 업로드
									</Button>
								</div>
								<div className={cn("invisible", "flex items-center justify-center gap-1")}>
									<Circle />
									<span className="text-[#3884FF] text-sm font-extrabold ">완료 !</span>
								</div>
							</div>
						</div>

						{/* 오른쪽 부분 */}
						<div className="flex flex-col gap-2.5">
							{/* 제목 입력 */}
							<div className="flex flex-col gap-[5px]">
								<div className="font-[SUIT] text-xs flex justify-between">
									<div className="text-black font-extrabold leading-[160%] tracking-[-0.24px]">제목</div>
									<div className="text-hbc-red font-semibold leading-[150%] tracking-[0.12px]">
										필수 입력사항 입니다.
									</div>
								</div>
								<Controller
									name="title"
									control={control}
									render={({ field }) => (
										<Input
											variant={"rounded"}
											{...field}
											className={errors.title ? "border-red-500" : ""}
										/>
									)}
								/>
								{errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
							</div>

							{/* 곡 설명/가사 입력 */}
							<div className="flex flex-col gap-[5px]">
								<div className="font-[SUIT] text-xs flex justify-between">
									<div className="text-black font-extrabold leading-[160%] tracking-[-0.24px]">곡 설명 / 가사</div>
									<div className="text-hbc-red font-semibold leading-[150%] tracking-[0.12px]">
										필수 입력사항 입니다.
									</div>
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
								{errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
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
									variant={watchedCategory === "ACAPELLA" ? "fill" : "outline"}
									rounded={"full"}
									className="flex-1 flex items-center justify-center"
									onClick={() => onChangeCategory("ACAPELLA")}
									type="button"
								>
									<Acapella
										width="90"
										height="12"
										fill={watchedCategory === "ACAPELLA" ? "white" : "black"}
									/>
								</Button>
							</div>

							{/* 장르 선택 */}
							<div className="flex flex-col gap-[5px]">
								<div className="font-[SUIT] text-xs flex justify-between">
									<div className="text-black font-extrabold leading-[160%] tracking-[-0.24px]">장르</div>
									<div className="text-hbc-red font-semibold leading-[150%] tracking-[0.12px]">
										필수 입력사항 입니다.
									</div>
								</div>
								<div
									className={cn(
										"flex gap-[5px] p-2 border-x-[1px] border-y-[2px] border-black rounded-[5px]",
										errors.genres && "border-red-500",
									)}
								>
									<GenreButton
										name="Hip-hop"
										showDeleteButton
										onDelete={() => {
											alert("Hip-hop 장르 선택 해제");
										}}
									/>
									<GenreButton
										name="G-funk"
										showDeleteButton
										onDelete={() => {
											alert("G-funk 장르 선택 해제");
										}}
									/>
								</div>
								{errors.genres && <span className="text-red-500 text-xs">{errors.genres.message}</span>}
							</div>

							{/* 태그 선택 */}
							<div className="flex flex-col gap-[5px]">
								<div className="font-[SUIT] text-xs flex justify-between">
									<div className="text-black font-extrabold leading-[160%] tracking-[-0.24px]">태그</div>
									<div className="text-hbc-red font-semibold leading-[150%] tracking-[0.12px]">
										필수 입력사항 입니다.
									</div>
								</div>
								<div
									className={cn(
										"flex gap-[5px] p-2 border-x-[1px] border-y-[2px] border-black rounded-[5px] h-[92px]",
										errors.tags && "border-red-500",
									)}
								>
									<TagButton name="Hip-hop" />
									<TagButton name="G-funk" />
								</div>
								{errors.tags && <span className="text-red-500 text-xs">{errors.tags.message}</span>}
							</div>

							{/* BPM 설정 */}
							<div className="flex flex-col gap-[5px]">
								<div className="font-[SUIT] text-xs flex justify-between">
									<div className="text-black font-extrabold leading-[160%] tracking-[-0.24px]">BPM</div>
								</div>
								<BPMDropdown
									bpmType={watchedBpmType}
									bpmValue={watch("exactBPM")}
									bpmRangeValue={watch("bpmRange")}
									onChangeBPMType={onChangeBPMType}
									onChangeExactBPM={onChangeExactBPM}
									onChangeBPMRange={onChangeBPMRange}
									onClear={onClearBPM}
								/>
							</div>

							{/* Key 설정 (BEAT일 때만) */}
							{watchedCategory === "BEAT" && (
								<div className="flex flex-col gap-[5px]">
									<div className="font-[SUIT] text-xs flex justify-between">
										<div className="text-black font-extrabold leading-[160%] tracking-[-0.24px]">Key</div>
									</div>
									<KeyDropdown
										keyValue={watchedKeyValue}
										scaleValue={watchedScaleValue || null}
										onChangeKey={onChangeKey}
										onChangeScale={onChangeScale}
										onClear={onClearKey}
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
								{watchedLicenses.map((license, index) => (
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
								{errors.licenses && <span className="text-red-500 text-xs">{errors.licenses.message}</span>}

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
												defaultValue={field.value ? "공개" : "비공개"}
												options={[
													{ label: "공개", value: "공개" },
													{ label: "비공개", value: "비공개" },
												]}
												onChange={(value: string) => field.onChange(value === "공개")}
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
											checked={field.value}
											onChange={field.onChange}
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
						</div>
					</section>

					<PopupFooter>
						<PopupButton
							onClick={onClose}
							type="button"
							className="bg-white px-2 py-1 text-hbc-gray-200 border-b-2 border-hbc-gray-200 rounded-none font-[Suisse Int'l] text-[24px] font-bold leading-normal tracking-[0.24px]"
						>
							CANCEL
						</PopupButton>
						<PopupButton
							type="submit"
							className="bg-white px-2 py-1 text-hbc-red border-b-2 border-hbc-red rounded-none font-[SUIT] text-[24px] font-extrabold leading-normal tracking-[0.24px]"
						>
							SAVE
						</PopupButton>
					</PopupFooter>
				</form>
			</PopupContent>
		</Popup>
	);
};

export default ArtistStudioDashEditTrackModal;
