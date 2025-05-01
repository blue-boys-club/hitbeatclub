export type Order = {
	id: string; // Unique ID for the order
	orderDate: string;
	orderTime: string;
	userInfo: UserInfo;
	productsByArtist: ProductsByArtist;
	subtotal: number;
	serviceFee: number;
	total: number;
};

export type UserInfo = {
	name: string;
	email: string;
	phone: string;
	address: string;
};

export type ContactLinkType =
	| "phone"
	| "email"
	| "kakaotalk"
	| "discord"
	| "line"
	| "instagram"
	| "youtube"
	| "facebook" // Keep types even if using generic icon
	| "soundcloud"
	| "website"
	| "other";

// Simplified ContactLink type
export type ContactLink = {
	type: ContactLinkType;
	value: string; // Represents phone number, email, ID, or URL
};

// Artist information (separated from Product)
export type ArtistInfo = {
	id: string;
	name: string;
	realName: string;
	location: string;
	city: string;
	iconUrl?: string;
	links: ContactLink[];
};

export type Product = {
	id: string;
	// Artist info is now linked via grouping, not directly in Product
	imageUrl: string;
	title: string;
	type: "acapella" | "beat";
	licenseType: string; // e.g., "Exclusive (mp3, wav, stems)"
	bpm?: number;
	key?: string; // e.g., "A min"
	price: number;
	downloadStatus: "available" | "downloaded" | "unavailable"; // Example status
	licenseUrl: string;
};

export type ProductsByArtist = Record<string, { artistInfo: ArtistInfo; products: Product[] }>;
