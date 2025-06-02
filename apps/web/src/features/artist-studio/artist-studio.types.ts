import { FieldErrors } from "react-hook-form";

// Common Types
export interface BaseItem {
	label: string;
	value: string;
}

export interface SnsSectionProps {
	selectedSns: BaseItem;
	userSnsList: BaseItem[];
	errors: FieldErrors<ProfileFormState>;
	onChangeLabel: (label: string) => void;
	onChangeValue: (value: string) => void;
	onAddSns: () => void;
	onRemoveSns: (label: string) => void;
}

export interface ContactSectionProps {
	selectedContact: BaseItem;
	userContactList: BaseItem[];
	errors: FieldErrors<ProfileFormState>;
	onChangeLabel: (label: string) => void;
	onChangeValue: (value: string) => void;
	onAddContact: () => void;
	onRemoveContact: (label: string) => void;
}

// Form State Types
export interface ProfileFormState {
	stageName: string;
	slug: string;
	description: string;
	profileImageUrl: string;
	snsList: BaseItem[];
	contactList: BaseItem[];
	country: BaseItem;
	city: BaseItem;
}
