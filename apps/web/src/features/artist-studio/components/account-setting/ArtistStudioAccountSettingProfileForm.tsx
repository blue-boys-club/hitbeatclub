"use client";

import { memo } from "react";
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
import {
	cityOptions,
	contactOptions,
	countryOptions,
	snsOptions,
	useProfileForm,
} from "@/features/artist/hooks/useProfileForm";

interface SnsItem {
	label: string;
	value: string;
}

interface ContactItem {
	label: string;
	value: string;
}

interface LocationItem {
	label: string;
	value: string;
}

interface FormData {
	profileImage: string | null;
	name: string;
	artistUrl: string;
	description: string;
	selectedSns: SnsItem;
	selectedContact: ContactItem;
	selectedCountry: LocationItem;
	selectedCity: LocationItem;
	userSnsList: SnsItem[];
	userContactList: ContactItem[];
}

interface ArtistStudioAccountSettingProfileFormProps {
	className?: string;
}

interface SnsSectionProps {
	selectedSns: SnsItem;
	userSnsList: SnsItem[];
	onChangeField: (field: keyof FormData, value: any) => void;
	onAddSns: () => void;
	onRemoveSns: (label: string) => void;
}

interface ContactSectionProps {
	selectedContact: ContactItem;
	userContactList: ContactItem[];
	onChangeField: (field: keyof FormData, value: any) => void;
	onAddContact: () => void;
	onRemoveContact: (label: string) => void;
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
 * 프로필 이미지 업로드를 처리하는 이벤트 핸들러
 */
const onUploadProfileImage = (
	e: React.ChangeEvent<HTMLInputElement>,
	onChangeField: (field: keyof FormData, value: any) => void,
) => {
	const file = e.target.files?.[0];
	if (file) {
		const reader = new FileReader();
		reader.onloadend = () => {
			onChangeField("profileImage", reader.result as string);
		};
		reader.readAsDataURL(file);
	}
};

/**
 * SNS 섹션 컴포넌트
 */
const SnsSection = memo(({ selectedSns, userSnsList, onChangeField, onAddSns, onRemoveSns }: SnsSectionProps) => (
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
				options={snsOptions}
				defaultValue={snsOptions[0]?.value}
				onChange={(value) => onChangeField("selectedSns", { ...selectedSns, label: value })}
			/>
			<Input
				className="flex-1"
				value={selectedSns.value}
				onChange={(e) =>
					onChangeField("selectedSns", {
						...selectedSns,
						value: e.target.value,
					})
				}
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
						className="flex-1"
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
));

SnsSection.displayName = "SnsSection";

/**
 * 연락처 섹션 컴포넌트
 */
const ContactSection = memo(
	({ selectedContact, userContactList, onChangeField, onAddContact, onRemoveContact }: ContactSectionProps) => (
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
					options={contactOptions}
					defaultValue={contactOptions[0]?.value}
					onChange={(value) => onChangeField("selectedContact", { ...selectedContact, label: value })}
				/>
				<Input
					className="flex-1"
					value={selectedContact.value}
					onChange={(e) =>
						onChangeField("selectedContact", {
							...selectedContact,
							value: e.target.value,
						})
					}
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
							className="flex-1"
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
 *
 * @description
 * 아티스트의 프로필 정보를 관리하는 폼 컴포넌트입니다.
 * - 프로필 이미지 업로드
 * - 활동명 설정
 * - 아티스트 URL 설정
 * - 설명 입력
 * - SNS 링크 관리
 * - 연락처 정보 관리
 * - 국가/도시 정보 설정
 */
export const ArtistStudioAccountSettingProfileForm = memo<ArtistStudioAccountSettingProfileFormProps>(() => {
	const {
		formData,
		isPopupOpen,
		onClosePopup,
		onChangeField,
		onAddSns,
		onRemoveSns,
		onAddContact,
		onRemoveContact,
		onSubmit,
	} = useProfileForm();

	return (
		<>
			<form onSubmit={onSubmit}>
				<div className="flex gap-8">
					<div className="flex flex-col items-center gap-4">
						<AlbumAvatar src={formData.profileImage || "https://placehold.co/252x252"} />
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
							onChange={(e) => onUploadProfileImage(e, onChangeField)}
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
							<Input
								id="name"
								value={formData.name}
								onChange={(e) => onChangeField("name", e.target.value)}
							/>
						</div>

						<div className="flex flex-col gap-2">
							<label
								htmlFor="artistUrl"
								className="text-[16px] font-bold tracking-0.16px"
							>
								아티스트 URL
							</label>
							<div className="flex items-center gap-2">
								<span className="text-black/40 font-bold">https://www.hitbeatclub.com/</span>
								<Input
									id="artistUrl"
									value={formData.artistUrl}
									onChange={(e) => onChangeField("artistUrl", e.target.value)}
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
							<textarea
								id="description"
								className="w-full h-[100px] p-[5px] border-x-[1px] border-y-[2px] rounded-[5px] resize-none focus:outline-none"
								value={formData.description}
								onChange={(e) => onChangeField("description", e.target.value)}
								maxLength={9000}
							/>
							<div className="absolute bottom-2 right-2 text-sm text-gray-400">{formData.description.length}/9000</div>
						</div>

						<SnsSection
							selectedSns={formData.selectedSns}
							userSnsList={formData.userSnsList}
							onChangeField={onChangeField}
							onAddSns={onAddSns}
							onRemoveSns={onRemoveSns}
						/>

						<ContactSection
							selectedContact={formData.selectedContact}
							userContactList={formData.userContactList}
							onChangeField={onChangeField}
							onAddContact={onAddContact}
							onRemoveContact={onRemoveContact}
						/>

						<div className="flex flex-col gap-2">
							<label
								htmlFor="country"
								className="text-[16px] font-bold tracking-0.16px"
							>
								국가
							</label>
							<Dropdown
								className="w-full"
								options={countryOptions}
								defaultValue={countryOptions[0]?.value}
								onChange={(value) => onChangeField("selectedCountry", { ...formData.selectedCountry, label: value })}
							/>
						</div>

						<div className="flex flex-col gap-2">
							<label
								htmlFor="city"
								className="text-[16px] font-bold tracking-0.16px"
							>
								도시
							</label>
							<Dropdown
								className="w-full"
								options={cityOptions}
								defaultValue={cityOptions[0]?.value}
								onChange={(value) => onChangeField("selectedCity", { ...formData.selectedCity, label: value })}
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
