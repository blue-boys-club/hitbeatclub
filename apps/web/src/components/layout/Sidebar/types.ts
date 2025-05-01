export type Tab = "like" | "follow";

// TODO: Use proper types
export interface ProductItem {
	id: number;
	title: string;
	artist: string;
	imageUrl: string;
}

// TODO: Use proper types
export interface FollowItem {
	id: number;
	name: string;
	imageUrl: string;

	isNotification: boolean;
	isVerified: boolean;
}
