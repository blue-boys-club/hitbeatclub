import { FieldErrors } from "react-hook-form";
import { ArtistUpdateRequest, ArtistUpdateSchema } from "@hitbeatclub/shared-types/artist";
import { z } from "zod";

// Common Types
export interface BaseItem {
	label: string;
	value: string;
}

// UI 폼용 확장된 Zod 스키마 (ArtistUpdateSchema 기반)
export const ProfileFormSchema = ArtistUpdateSchema.extend({
	snsList: z
		.array(
			z.object({
				label: z.string(),
				value: z.string(),
			}),
		)
		.optional(),
	contactList: z
		.array(
			z.object({
				label: z.string(),
				value: z.string(),
			}),
		)
		.optional(),
	country: z
		.object({
			label: z.string(),
			value: z.string(),
		})
		.optional(),
	city: z
		.object({
			label: z.string(),
			value: z.string(),
		})
		.optional(),
});

// Zod 스키마에서 타입 추론
export type ProfileFormData = z.infer<typeof ProfileFormSchema>;

export interface SnsSectionProps {
	selectedSns: BaseItem;
	userSnsList: BaseItem[];
	errors: FieldErrors<ProfileFormData>;
	onChangeLabel: (label: string) => void;
	onChangeValue: (value: string) => void;
	onAddSns: () => void;
	onRemoveSns: (label: string) => void;
}

export interface ContactSectionProps {
	selectedContact: BaseItem;
	userContactList: BaseItem[];
	errors: FieldErrors<ProfileFormData>;
	onChangeLabel: (label: string) => void;
	onChangeValue: (value: string) => void;
	onAddContact: () => void;
	onRemoveContact: (label: string) => void;
}
