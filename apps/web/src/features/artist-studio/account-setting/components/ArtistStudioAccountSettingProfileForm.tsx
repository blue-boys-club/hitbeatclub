"use client";

import { memo, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { useCreateArtistMutation, useUpdateArtistMutation } from "@/apis/artist/mutation";
import { useQuery } from "@tanstack/react-query";
import { getArtistMeQueryOption } from "@/apis/artist/query/artist.query-options";
import { ContactSectionProps, ProfileFormState, SnsSectionProps } from "@/features/artist-studio/artist-studio.types";
import { CITY_OPTIONS, CONTACT_OPTIONS, COUNTRY_OPTIONS, SNS_OPTIONS } from "../../artist-studio.constants";
import { cn } from "@/common/utils";

interface BaseItem {
	label: string;
	value: string;
}

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
			<div
				className="flex justify-center mt-4 cursor-pointer"
				onClick={onAddSns}
			>
				<AddCircle />
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
							className="cursor-pointer"
							onClick={() => onRemoveSns(sns.label)}
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
			<div
				className="flex justify-center mt-4 cursor-pointer"
				onClick={onAddContact}
			>
				<AddCircle />
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
							className="cursor-pointer"
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
	const [formData, setFormData] = useState<ProfileFormState>({
		stageName: "",
		slug: "",
		description: "",
		profileImageUrl: "",
		snsList: [],
		contactList: [],
		country: { label: "", value: COUNTRY_OPTIONS[0]?.value || "" },
		city: { label: "", value: CITY_OPTIONS[0]?.value || "" },
	});

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
	} = useForm<ProfileFormState>({
		values: formData,
	});

	const { data: artistMe } = useQuery(getArtistMeQueryOption());
	const { mutate: createArtist } = useCreateArtistMutation();
	const { mutate: updateArtist } = useUpdateArtistMutation();

	const onChangeField = (field: keyof ProfileFormState, value: any) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const onAddSns = () => {
		const { label, value } = selectedSns;
		setFormData((prev) => ({
			...prev,
			snsList: [...prev.snsList, { label, value }],
		}));
		setSelectedSns({ label: "", value: "" });
	};

	const onRemoveSns = (label: string) => {
		setFormData((prev) => ({
			...prev,
			snsList: prev.snsList.filter((sns) => sns.label !== label),
		}));
	};

	const onAddContact = () => {
		const { label, value } = selectedContact;
		setFormData((prev) => ({
			...prev,
			contactList: [...prev.contactList, { label, value }],
		}));
		setSelectedContact({ label: "", value: "" });
	};

	const onRemoveContact = (label: string) => {
		setFormData((prev) => ({
			...prev,
			contactList: prev.contactList.filter((contact) => contact.label !== label),
		}));
	};

	const onSubmitForm = handleSubmit((data) => {
		const { stageName, slug, description, profileImageUrl, country, city } = data;

		const payload = {
			stageName,
			slug,
			description,
			profileImageUrl,
			instagramAccount: formData.snsList.find((sns) => sns.label === "instagram")?.value ?? "",
			youtubeAccount: formData.snsList.find((sns) => sns.label === "youtube")?.value ?? "",
			tiktokAccount: formData.snsList.find((sns) => sns.label === "tiktok")?.value ?? "",
			soundcloudAccount: formData.snsList.find((sns) => sns.label === "soundcloud")?.value ?? "",
			kakaoAccount: formData.contactList.find((contact) => contact.label === "kakao")?.value ?? "",
			lineAccount: formData.contactList.find((contact) => contact.label === "line")?.value ?? "",
			discordAccount: formData.contactList.find((contact) => contact.label === "discord")?.value ?? "",
			country: "KOR",
			// country: country.value,
			city: city.value,
		};

		if (artistMe?.id) {
			updateArtist({ id: artistMe.id, payload });
		}

		createArtist(payload);
		setIsPopupOpen(true);
	});

	const onClosePopup = () => {
		setIsPopupOpen(false);
	};

	useEffect(() => {
		if (artistMe) {
			// SNS 정보 필터링
			const snsList = [
				{ label: "instagram", value: artistMe.instagramAccount },
				{ label: "youtube", value: artistMe.youtubeAccount },
				{ label: "tiktok", value: artistMe.tiktokAccount },
				{ label: "soundcloud", value: artistMe.soundcloudAccount },
			].filter((sns) => sns.value); // value가 있는 항목만 필터링

			// 연락처 정보 필터링
			const contactList = [
				{ label: "kakao", value: artistMe.kakaoAccount },
				{ label: "line", value: artistMe.lineAccount },
				{ label: "discord", value: artistMe.discordAccount },
			].filter((contact) => contact.value); // value가 있는 항목만 필터링

			const newFormData = {
				stageName: artistMe.stageName,
				slug: artistMe.slug,
				description: artistMe.description,
				profileImageUrl: artistMe.profileImageUrl,
				snsList,
				contactList,
				country: { label: artistMe.country, value: "KOR" },
				city: { label: artistMe.city, value: "seoul" },
			};
			setFormData(newFormData);
		}
	}, [artistMe]);

	return (
		<>
			<form onSubmit={onSubmitForm}>
				<div className="flex gap-8">
					<div className="flex flex-col items-center gap-4">
						<AlbumAvatar src={formData.profileImageUrl || "https://placehold.co/252x252"} />
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
								// const file = e.target.files?.[0];
								// if (file) {
								// 	const reader = new FileReader();
								// 	reader.onloadend = () => {
								// 		setValue("profileImage", reader.result as string);
								// 		onChangeField("profileImage", reader.result as string);
								// 	};
								// 	reader.readAsDataURL(file);
								// }
							}}
						/>
					</div>

					<div className="flex flex-col gap-8">
						<div className="flex flex-col gap-2">
							<label
								htmlFor="name"
								className="text-[16px] font-bold tracking-0.16px"
							>
								활동명
							</label>
							<Controller
								name="stageName"
								rules={{ required: true }}
								control={control}
								render={({ field }) => (
									<Input
										id="name"
										{...field}
										className={cn(errors.stageName && "border-red-500")}
										onChange={(e) => {
											field.onChange(e);
											onChangeField("stageName", e.target.value);
										}}
									/>
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
							<div className="flex items-center gap-2">
								<span className="text-black/40 font-bold">https://www.hitbeatclub.com/</span>
								<Controller
									name="slug"
									rules={{ required: true }}
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
								control={control}
								render={({ field }) => (
									<>
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
										<div className="absolute bottom-2 right-2 text-sm text-gray-400">{field.value.length}/9000</div>
									</>
								)}
							/>
						</div>

						<Controller
							name="snsList"
							control={control}
							render={() => (
								<SnsSection
									selectedSns={selectedSns}
									userSnsList={formData.snsList}
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
									userContactList={formData.contactList}
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
								control={control}
								render={() => (
									<Dropdown
										className={cn("w-full", errors.country && "border-red-500")}
										options={COUNTRY_OPTIONS}
										defaultValue={formData.country.value}
										onChange={(value) => {
											onChangeField("country", value);
										}}
									/>
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
								control={control}
								render={() => (
									<Dropdown
										className={cn("w-full", errors.city && "border-red-500")}
										options={CITY_OPTIONS}
										defaultValue={formData.city.value}
										onChange={(value) => {
											onChangeField("city", value);
										}}
									/>
								)}
							/>
						</div>

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
