import { FieldErrors } from "react-hook-form";
import { ArtistUpdateSchema } from "@hitbeatclub/shared-types/artist";
import { ProductCreateSchema } from "@hitbeatclub/shared-types/product";
import { z } from "zod";
import { deepRemoveDefaults } from "@/lib/schema.utils";

// Common Types
export interface BaseItem {
	label: string;
	value: string;
}

// UI 폼용 확장된 Zod 스키마 (ArtistUpdateSchema 기반)
export const ProfileFormSchema = ArtistUpdateSchema.extend({
	stageName: z.string().min(1, "활동명을 입력해주세요"),
	slug: z.string().min(1, "URL을 입력해주세요"),
	description: z.string().min(1, "설명을 입력해주세요"),
	profileImageUrl: z.string().optional(), // UI 표시용
	snsList: z.array(
		z.object({
			label: z.string(),
			value: z.string(),
		}),
	),
	contactList: z.array(
		z.object({
			label: z.string(),
			value: z.string(),
		}),
	),
});

// 트랙 업로드 모달용 UI 확장 스키마 (ProductCreateSchema 기반) - BPM 필드 단순화
export const TrackUploadFormSchema = deepRemoveDefaults(ProductCreateSchema).extend({
	// UI에서만 사용되는 필드들
	keyValue: z
		.object({
			label: z.string(),
			value: z.string(),
		})
		.optional(),
	scaleValue: z.string().nullable().optional(),
});

// Zod 스키마에서 타입 추론
export type ProfileFormData = z.infer<typeof ProfileFormSchema>;
export type TrackUploadFormData = z.infer<typeof TrackUploadFormSchema>;

export const ArtistUpdateSchemaWithoutDefaults = deepRemoveDefaults(ArtistUpdateSchema);

export interface SnsSectionProps {
	selectedSns: BaseItem;
	userSnsList: BaseItem[];
	errors: FieldErrors<ProfileFormData>;
	onChangeLabel: (label: string) => void;
	onChangeValue: (value: string) => void;
	onAddSns: () => void;
	onRemoveSns: (label: string, value?: string) => void;
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
