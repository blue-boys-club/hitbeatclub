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
	artistId: number;
	stageName: string;
	profileImageUrl: string;

	isNotification: boolean;
	isVerified: boolean;
}
