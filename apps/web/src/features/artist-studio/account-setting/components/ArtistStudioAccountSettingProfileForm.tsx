"use client";

import { memo, useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlbumAvatar, Dropdown, Input } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { PopupFooter, PopupTitle, Popup, PopupContent, PopupHeader } from "@/components/ui/Popup";
import {
	AddCircle,
	Discord,
	KaKaoTalk,
	Line,
	LineInstagram,
	MinusCircle,
	SoundCloud,
	Tiktok,
	Youtube,
} from "@/assets/svgs";
import { useUpdateArtistMutation } from "@/apis/artist/mutation";
import { useUploadArtistProfileMutation } from "@/apis/artist/mutation/useUploadArtistProfileMutation";
import { useQuery } from "@tanstack/react-query";
import { getArtistMeQueryOption } from "@/apis/artist/query/artist.query-options";
import {
	ContactSectionProps,
	SnsSectionProps,
	ProfileFormData,
	BaseItem,
	ProfileFormSchema,
} from "@/features/artist-studio/artist-studio.types";

import { CONTACT_OPTIONS, SNS_OPTIONS } from "../../artist-studio.constants";
import { COUNTRY_OPTIONS, CountryCode, getRegionOptionsByCountry } from "@/features/common/common.constants";
import { cn } from "@/common/utils";
import { ArtistUpdateRequest } from "@hitbeatclub/shared-types/artist";
import { ENUM_FILE_TYPE } from "@hitbeatclub/shared-types/file";
import UserProfileImage from "@/assets/images/user-profile.png";
import * as ScrollArea from "@radix-ui/react-scroll-area";

const renderSnsIcon = (label: string) => {
	switch (label) {
		case "instagram":
			return <LineInstagram />;
		case "youtube":
			return <Youtube />;
		case "tiktok":
			return <Tiktok />;
		case "soundcloud":
			return <SoundCloud />;
		case "etc":
			return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
		default:
			return null;
	}
};

const renderContactIcon = (label: string) => {
	switch (label) {
		case "kakao":
			return <KaKaoTalk />;
		case "line":
			return <Line />;
		case "discord":
			return <Discord />;
		default:
			return null;
	}
};

/**
 * SNS 섹션 컴포넌트
 */
const SnsSection = memo(
	({ selectedSns, userSnsList, errors, onChangeLabel, onChangeValue, onAddSns, onRemoveSns }: SnsSectionProps) => (
		<div className="flex flex-col gap-2">
			<label
				htmlFor="sns"
				className="text-[16px] font-bold tracking-0.16px"
			>
				SNS
			</label>
			<div className="flex flex-col gap-2">
				<div className="flex items-center gap-2.5">
					<Dropdown
						className="w-[135px]"
						options={SNS_OPTIONS}
						defaultValue={SNS_OPTIONS[0]?.value}
						onChange={(value) => {
							onChangeLabel(value);
						}}
					/>
					<Input
						className={cn("flex-1 text-hbc-gray-300", errors.snsList && "border-red-500")}
						value={selectedSns.value}
						onChange={(e) => {
							onChangeValue(e.target.value);
						}}
					/>
				</div>
				{errors.snsList && <span className="text-red-500 text-sm flex justify-end">최소 1개 이상 입력해주세요</span>}
			</div>
			<div className="flex justify-center mt-4">
				<div
					className="w-6 h-6 cursor-pointer"
					onClick={onAddSns}
				>
					<AddCircle />
				</div>
			</div>

			<ul className="mt-4 space-y-2">
				{userSnsList.map((sns) => (
					<li
						key={sns.label}
						className="flex items-center gap-3"
					>
						<div className="w-6 h-6 flex items-center justify-center">{renderSnsIcon(sns.label)}</div>
						<Input
							className="flex-1 text-hbc-gray-300"
							variant="square"
							value={sns.value}
							readOnly
						/>
						<div
							className="w-6 h-6 flex items-center justify-center cursor-pointer mr-2"
							onClick={() => onRemoveSns(sns.label, sns.value)}
						>
							<MinusCircle />
						</div>
					</li>
				))}
			</ul>
		</div>
	),
);

SnsSection.displayName = "SnsSection";

/**
 * 연락처 섹션 컴포넌트
 */
const ContactSection = memo(
	({
		selectedContact,
		userContactList,
		errors,
		onChangeLabel,
		onChangeValue,
		onAddContact,
		onRemoveContact,
	}: ContactSectionProps) => (
		<div className="flex flex-col gap-2">
			<label
				htmlFor="contact"
				className="text-[16px] font-bold tracking-0.16px"
			>
				연락처
			</label>
			<div className="flex flex-col gap-2">
				<div className="flex items-center gap-2.5">
					<Dropdown
						className="w-[135px]"
						options={CONTACT_OPTIONS}
						defaultValue={CONTACT_OPTIONS[0]?.value}
						onChange={(value) => {
							onChangeLabel(value);
						}}
					/>
					<Input
						className={cn("flex-1 text-hbc-gray-300", errors.contactList && "border-red-500")}
						value={selectedContact.value}
						onChange={(e) => {
							onChangeValue(e.target.value);
						}}
					/>
				</div>
				{errors.contactList && (
					<span className="text-red-500 text-sm flex justify-end">최소 1개 이상 입력해주세요</span>
				)}
			</div>
			<div className="flex justify-center mt-4">
				<div
					className="w-6 h-6 cursor-pointer"
					onClick={onAddContact}
				>
					<AddCircle />
				</div>
			</div>

			<ul className="mt-4 space-y-2">
				{userContactList.map((contact) => (
					<li
						key={contact.label}
						className="flex items-center gap-3"
					>
						<div className="w-6 h-6 flex items-center justify-center">{renderContactIcon(contact.label)}</div>
						<Input
							className="flex-1 text-hbc-gray-300"
							variant="square"
							value={contact.value}
							readOnly
						/>
						<div
							className="w-6 h-6 flex items-center justify-center cursor-pointer mr-2"
							onClick={() => onRemoveContact(contact.label)}
						>
							<MinusCircle />
						</div>
					</li>
				))}
			</ul>
		</div>
	),
);

ContactSection.displayName = "ContactSection";

/**
 * 아티스트 스튜디오 계정 설정의 프로필 폼 컴포넌트
 */
export const ArtistStudioAccountSettingProfileForm = memo(() => {
	const initialFormData: ProfileFormData = {
		stageName: "",
		slug: "",
		description: "",
		profileImageFileId: undefined,
		profileImageUrl: "",
		snsList: [],
		contactList: [],
		country: "KOR",
		city: "",
	};

	// 복잡한 배열 조작이 필요한 것들만 로컬 상태로 관리
	const [snsList, setSnsList] = useState<BaseItem[]>([]);
	const [contactList, setContactList] = useState<BaseItem[]>([]);

	const [selectedSns, setSelectedSns] = useState<BaseItem>({ label: SNS_OPTIONS[0]?.value || "", value: "" });
	const [selectedContact, setSelectedContact] = useState<BaseItem>({
		label: CONTACT_OPTIONS[0]?.value || "",
		value: "",
	});

	const [isPopupOpen, setIsPopupOpen] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors },
		watch,
		reset,
		setValue,
		getValues,
	} = useForm<ProfileFormData>({
		resolver: zodResolver(ProfileFormSchema),
		defaultValues: initialFormData,
	});

	const { data: artistMe, isLoading, isError } = useQuery(getArtistMeQueryOption());
	const { mutate: updateArtist } = useUpdateArtistMutation();
	const { mutate: uploadProfile } = useUploadArtistProfileMutation();

	const onChangeField = useCallback(
		(field: keyof ProfileFormData, value: string) => {
			setValue(field, value);
		},
		[setValue],
	);

	const onAddSns = useCallback(() => {
		const { label, value } = selectedSns;
		if (!label || !value) return;

		setSnsList((prev) => {
			let existingIndex = -1;

			if (label === "etc") {
				// etc 타입은 같은 링크(value) 기준으로 중복 체크
				existingIndex = prev.findIndex((sns: BaseItem) => sns.label === "etc" && sns.value === value);
			} else {
				// 다른 타입은 label 기준으로 중복 체크 (기존 로직)
				existingIndex = prev.findIndex((sns: BaseItem) => sns.label === label);
			}

			if (existingIndex !== -1) {
				// 중복된 경우, etc 타입이 아니면 기존 아이템 업데이트
				if (label !== "etc") {
					const updatedSnsList = [...prev];
					updatedSnsList[existingIndex] = { label, value };
					return updatedSnsList;
				} else {
					// etc 타입이면서 같은 링크가 이미 있으면 추가하지 않음
					return prev;
				}
			} else {
				// 새 아이템 추가
				return [...prev, { label, value }];
			}
		});
		setSelectedSns({ label, value: "" });
	}, [selectedSns]);

	const onRemoveSns = useCallback((label: string, value?: string) => {
		setSnsList((prev) =>
			prev.filter((sns: BaseItem) => {
				if (label === "etc") {
					// etc 타입은 label과 value 모두 일치해야 삭제
					return !(sns.label === label && sns.value === value);
				} else {
					// 다른 타입은 label만 일치하면 삭제
					return sns.label !== label;
				}
			}),
		);
	}, []);

	const onAddContact = useCallback(() => {
		const { label, value } = selectedContact;
		if (!label || !value) return;

		setContactList((prev) => {
			const existingIndex = prev.findIndex((contact: BaseItem) => contact.label === label);

			if (existingIndex !== -1) {
				// 기존 아이템 업데이트
				const updatedContactList = [...prev];
				updatedContactList[existingIndex] = { label, value };
				return updatedContactList;
			} else {
				// 새 아이템 추가
				return [...prev, { label, value }];
			}
		});
		setSelectedContact({ label, value: "" });
	}, [selectedContact]);

	const onRemoveContact = useCallback((label: string) => {
		setContactList((prev) => prev.filter((contact: BaseItem) => contact.label !== label));
	}, []);

	const onClosePopup = useCallback(() => {
		setIsPopupOpen(false);
	}, []);

	const onUploadProfileImage = useCallback(
		(file: File) => {
			uploadProfile(
				{
					file,
					type: ENUM_FILE_TYPE.ARTIST_PROFILE_IMAGE,
				},
				{
					onSuccess: (response) => {
						console.log("profileImageUrl", response.data.url);
						console.log("profileImageFileId", response.data.id);
						// URL을 UI에 표시하고, fileId를 form data에 저장
						setValue("profileImageUrl", response.data.url);
						setValue("profileImageFileId", response.data.id);
					},
					onError: (error) => {
						console.error("파일 업로드 실패:", error);
					},
				},
			);
		},
		[uploadProfile, setValue],
	);

	const onSubmitForm = useCallback(
		(data: ProfileFormData) => {
			const { stageName, slug, description, profileImageFileId, country, city } = data;

			const payload: ArtistUpdateRequest = {
				stageName,
				slug,
				description,
				profileImageFileId,
				instagramAccount: (snsList || []).find((sns: BaseItem) => sns.label === "instagram")?.value,
				youtubeAccount: (snsList || []).find((sns: BaseItem) => sns.label === "youtube")?.value,
				tiktokAccount: (snsList || []).find((sns: BaseItem) => sns.label === "tiktok")?.value,
				soundcloudAccount: (snsList || []).find((sns: BaseItem) => sns.label === "soundcloud")?.value,
				etcAccounts: (snsList || []).filter((sns: BaseItem) => sns.label === "etc").map((sns: BaseItem) => sns.value),
				// etcAccounts: ["https://twitter.com/djcool"]
				kakaoAccount: (contactList || []).find((contact: BaseItem) => contact.label === "kakao")?.value,
				lineAccount: (contactList || []).find((contact: BaseItem) => contact.label === "line")?.value,
				discordAccount: (contactList || []).find((contact: BaseItem) => contact.label === "discord")?.value,
				country: country,
				city: city,
			};

			if (artistMe?.id) {
				updateArtist({ id: artistMe.id, payload });
				setIsPopupOpen(true);
			}
		},
		[snsList, contactList, artistMe, updateArtist],
	);

	useEffect(() => {
		if (artistMe) {
			// SNS 정보 필터링
			const snsList = [
				{ label: "instagram", value: artistMe.instagramAccount },
				{ label: "youtube", value: artistMe.youtubeAccount },
				{ label: "tiktok", value: artistMe.tiktokAccount },
				{ label: "soundcloud", value: artistMe.soundcloudAccount },
			].filter((sns): sns is { label: string; value: string } => Boolean(sns.value));

			// etcAccounts 추가
			if (artistMe.etcAccounts) {
				artistMe.etcAccounts.forEach((etcAccount: string) => {
					snsList.push({ label: "etc", value: etcAccount });
				});
			}

			// 연락처 정보 필터링
			const contactList = [
				{ label: "kakao", value: artistMe.kakaoAccount },
				{ label: "line", value: artistMe.lineAccount },
				{ label: "discord", value: artistMe.discordAccount },
			].filter((contact): contact is { label: string; value: string } => Boolean(contact.value));

			const newFormData: ProfileFormData = {
				stageName: artistMe.stageName || "",
				slug: artistMe.slug || "",
				description: artistMe.description || "",
				profileImageFileId: undefined,
				profileImageUrl: artistMe.profileImageUrl || artistMe.profileImage?.url || "",
				snsList: [],
				contactList: [],
				country: artistMe.country || "",
				city: artistMe.city || "",
			};

			setSnsList(snsList);
			setContactList(contactList);
			// 폼 데이터를 리셋하여 새로운 값으로 업데이트
			reset(newFormData);
		}
	}, [artistMe, reset]);

	const country = watch("country");
	const regionOptions = useMemo(() => {
		return country ? getRegionOptionsByCountry(country as CountryCode) : [];
	}, [country]);

	const profileImageUrl = watch("profileImageUrl");
	const profileUrl = useMemo(() => {
		if (!profileImageUrl || profileImageUrl === "") {
			return UserProfileImage;
		}
		return profileImageUrl;
	}, [profileImageUrl]);

	const scrollRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		if (scrollRef.current) {
			setTimeout(() => {
				scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight + 200, behavior: "smooth" });
			}, 0);
		}
	};

	return (
		<>
			<form
				onSubmit={handleSubmit(onSubmitForm)}
				className="flex flex-col gap-6"
			>
				<div className="flex flex-col items-center gap-6">
					<div className="flex gap-8">
						<div className="flex flex-col items-center gap-4">
							<AlbumAvatar src={profileUrl} />
							<label
								htmlFor="profileImage"
								className="inline-flex items-center justify-center rounded-full bg-hbc-black text-white px-4 py-2 text-md font-bold cursor-pointer"
							>
								프로필 이미지 업로드
							</label>
							<Input
								type="file"
								id="profileImage"
								accept="image/*"
								className="hidden"
								onChange={(e) => {
									const file = e.target.files?.[0];
									if (file) {
										onUploadProfileImage(file);
									}
								}}
							/>
						</div>

						<div className="flex flex-col items-center gap-6">
							<ScrollArea.Root className="h-[calc(100vh-292px)]">
								<ScrollArea.Viewport
									className="h-full w-full"
									ref={scrollRef}
								>
									<div className="flex flex-col gap-6 pr-4">
										<div className="flex flex-col gap-2">
											<label
												htmlFor="stageName"
												className="text-[16px] font-bold tracking-0.16px"
											>
												활동명
											</label>
											<Controller
												name="stageName"
												rules={{
													required: true,
												}}
												control={control}
												render={({ field }) => (
													<div className="flex flex-col gap-1">
														<Input
															id="stageName"
															{...field}
															className={cn(errors.stageName && "border-red-500")}
															onChange={(e) => {
																field.onChange(e);
																onChangeField("stageName", e.target.value);
															}}
														/>
														{errors.stageName && (
															<span className="text-red-500 text-sm flex justify-end">활동명을 입력해주세요</span>
														)}
													</div>
												)}
											/>
										</div>

										<div className="flex flex-col gap-2">
											<label
												htmlFor="slug"
												className="text-[16px] font-bold tracking-0.16px"
											>
												아티스트 URL
											</label>
											<div className="flex flex-col gap-1">
												<div className="flex items-center gap-2">
													<span className="text-black/40 font-bold">https://www.hitbeatclub.com/</span>
													<Controller
														name="slug"
														rules={{
															required: true,
														}}
														control={control}
														render={({ field }) => (
															<Input
																id="slug"
																{...field}
																className={cn(errors.slug && "border-red-500")}
																onChange={(e) => {
																	field.onChange(e);
																	onChangeField("slug", e.target.value);
																}}
															/>
														)}
													/>
												</div>
												{errors.slug && (
													<span className="text-red-500 text-sm flex justify-end">URL을 입력해주세요</span>
												)}
											</div>
										</div>

										<div className="relative flex flex-col gap-2">
											<label
												htmlFor="description"
												className="text-[16px] font-bold tracking-0.16px"
											>
												설명
											</label>
											<Controller
												name="description"
												rules={{
													required: "설명을 입력해주세요",
													maxLength: {
														value: 9000,
														message: "설명은 9000자 이하여야 합니다",
													},
												}}
												control={control}
												render={({ field }) => (
													<div className="flex flex-col gap-1">
														<div className="relative">
															<textarea
																id="description"
																className={cn(
																	"w-full h-[100px] p-[5px] border-x-[1px] border-y-[2px] rounded-[5px] resize-none focus:outline-none",
																	errors.description && "border-red-500",
																)}
																maxLength={9000}
																{...field}
																onChange={(e) => {
																	field.onChange(e);
																	onChangeField("description", e.target.value);
																}}
															/>
															<div className="absolute bottom-3 right-2 text-sm text-gray-400">
																{(field.value || "").length} / 9000
															</div>
														</div>
														{errors.description && (
															<span className="text-red-500 text-sm flex justify-end">
																{errors.description.message}
															</span>
														)}
													</div>
												)}
											/>
										</div>

										<Controller
											name="snsList"
											control={control}
											render={() => (
												<SnsSection
													selectedSns={selectedSns}
													userSnsList={snsList || []}
													errors={errors}
													onChangeLabel={(label) => {
														setSelectedSns((prev) => ({ ...prev, label: label }));
													}}
													onChangeValue={(value: string) => {
														setSelectedSns((prev) => ({ ...prev, value: value }));
													}}
													onAddSns={onAddSns}
													onRemoveSns={onRemoveSns}
												/>
											)}
										/>

										<Controller
											name="contactList"
											control={control}
											render={() => (
												<ContactSection
													selectedContact={selectedContact}
													userContactList={contactList || []}
													errors={errors}
													onChangeLabel={(label) => {
														setSelectedContact((prev) => ({ ...prev, label: label }));
													}}
													onChangeValue={(value: string) => {
														setSelectedContact((prev) => ({ ...prev, value: value }));
													}}
													onAddContact={onAddContact}
													onRemoveContact={onRemoveContact}
												/>
											)}
										/>

										<div className="flex flex-col gap-2">
											<label
												htmlFor="country"
												className="text-[16px] font-bold tracking-0.16px"
											>
												국가
											</label>
											<Controller
												name="country"
												rules={{ required: true }}
												control={control}
												render={({ field }) => (
													<div className="flex flex-col gap-1">
														<Dropdown
															className={cn("w-full")}
															buttonClassName={cn(errors.country && "border border-red-500")}
															options={COUNTRY_OPTIONS}
															value={field.value}
															defaultValue={field.value}
															placeholder="국가를 선택해주세요"
															onChange={(value) => {
																field.onChange(value);
																onChangeField("country", value);
															}}
															onClick={scrollToBottom}
															optionsClassName="max-h-[200px] overflow-y-auto"
														/>
														{errors.country && (
															<span className="text-red-500 text-sm flex justify-end">국가를 선택해주세요</span>
														)}
													</div>
												)}
											/>
										</div>

										<div className="flex flex-col gap-2">
											<label
												htmlFor="city"
												className="text-[16px] font-bold tracking-0.16px"
											>
												도시
											</label>
											<Controller
												name="city"
												rules={{ required: true }}
												control={control}
												render={({ field }) => (
													<div className="flex flex-col gap-1">
														<Dropdown
															className={cn("w-full")}
															buttonClassName={cn(errors.city && "border border-red-500")}
															options={regionOptions}
															value={field.value}
															defaultValue={field.value}
															placeholder="도시를 선택해주세요"
															onChange={(value) => {
																field.onChange(value);
																onChangeField("city", value);
															}}
															onClick={scrollToBottom}
															optionsClassName="max-h-[200px] overflow-y-auto"
														/>
														{errors.city && (
															<span className="text-red-500 text-sm flex justify-end">도시를 선택해주세요</span>
														)}
													</div>
												)}
											/>
										</div>
									</div>
								</ScrollArea.Viewport>
								<ScrollArea.Scrollbar
									className="flex select-none touch-none p-0.5 bg-gray-100 transition-colors duration-150 ease-out hover:bg-gray-200 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
									orientation="vertical"
								>
									<ScrollArea.Thumb className="flex-1 bg-gray-300 rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
								</ScrollArea.Scrollbar>
								<ScrollArea.Corner className="bg-gray-200" />
							</ScrollArea.Root>

							<Button
								wrapperClassName="flex justify-center"
								className="w-fit"
								type="submit"
								rounded="full"
							>
								저장하기
							</Button>
						</div>
					</div>
				</div>
			</form>

			<Popup
				open={isPopupOpen}
				onOpenChange={onClosePopup}
			>
				<PopupContent>
					<PopupHeader>
						<PopupTitle>프로필 설정이 완료되었습니다!</PopupTitle>
					</PopupHeader>
					<PopupFooter>
						<Button onClick={onClosePopup}>확인</Button>
					</PopupFooter>
				</PopupContent>
			</Popup>
		</>
	);
});

ArtistStudioAccountSettingProfileForm.displayName = "ArtistStudioAccountSettingProfileForm";
