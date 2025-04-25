import { useState } from "react";

interface SnsItem {
	label: string;
	value: string;
}

interface ProfileFormState {
	profileImage: string;
	name: string;
	artistUrl: string;
	description: string;
	selectedSns: SnsItem;
	userSnsList: SnsItem[];
	selectedContact: SnsItem;
	userContactList: SnsItem[];
	selectedCountry: SnsItem;
	selectedCity: SnsItem;
}

export const useProfileForm = () => {
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [formData, setFormData] = useState<ProfileFormState>({
		profileImage: "",
		name: "",
		artistUrl: "",
		description: "",
		selectedSns: { label: "instagram", value: "" },
		userSnsList: [],
		selectedContact: { label: "kakao", value: "" },
		userContactList: [],
		selectedCountry: { label: "한국", value: "" },
		selectedCity: { label: "서울", value: "" },
	});

	const onChangeField = (field: keyof ProfileFormState, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const onAddSns = () => {
		if (!formData.selectedSns.value.trim()) return;
		setFormData((prev) => ({
			...prev,
			userSnsList: [...prev.userSnsList, prev.selectedSns],
			selectedSns: { ...prev.selectedSns, value: "" },
		}));
	};

	const onRemoveSns = (label: string) => {
		setFormData((prev) => ({
			...prev,
			userSnsList: prev.userSnsList.filter((sns) => sns.label !== label),
		}));
	};

	const onAddContact = () => {
		if (!formData.selectedContact.value.trim()) return;
		setFormData((prev) => ({
			...prev,
			userContactList: [...prev.userContactList, prev.selectedContact],
			selectedContact: { ...prev.selectedContact, value: "" },
		}));
	};

	const onRemoveContact = (label: string) => {
		setFormData((prev) => ({
			...prev,
			userContactList: prev.userContactList.filter((contact) => contact.label !== label),
		}));
	};

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsPopupOpen(true);
		// TODO: API 호출 로직 추가
	};

	const onClosePopup = () => {
		setIsPopupOpen(false);
	};

	//TODO: uploadImage

	return {
		formData,
		isPopupOpen,
		onClosePopup,
		onChangeField,
		onAddSns,
		onRemoveSns,
		onAddContact,
		onRemoveContact,
		onSubmit,
	};
};

export const snsOptions = [
	{ label: "Instagram", value: "instagram" },
	{ label: "YouTube", value: "youtube" },
	{ label: "TikTok", value: "tiktok" },
	{ label: "SoundCloud", value: "soundcloud" },
];

export const contactOptions = [
	{ label: "Kakao", value: "kakao" },
	{ label: "Line", value: "line" },
	{ label: "Discord", value: "discord" },
];

export const countryOptions = [
	{ label: "한국", value: "한국" },
	{ label: "미국", value: "미국" },
];

export const cityOptions = [
	{ label: "서울", value: "서울" },
	{ label: "부산", value: "부산" },
	{ label: "대구", value: "대구" },
	{ label: "인천", value: "인천" },
];
