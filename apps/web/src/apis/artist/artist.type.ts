export interface ArtistDetailResponse {
	id: number;
	userId: number;
	stageName: string;
	slug: string;
	description: string;
	profileImageUrl: string;
	instagramAccount: string;
	youtubeAccount: string;
	tiktokAccount: string;
	soundcloudAccount: string;
	kakaoAccount: string;
	lineAccount: string;
	discordAccount: string;
	country: string;
	city: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string;
}

export interface ArtistMeResponse {
	id: number;
	userId: number;
	stageName: string;
	slug: string;
	description: string;
	profileImageUrl: string;
	instagramAccount: string;
	youtubeAccount: string;
	tiktokAccount: string;
	soundcloudAccount: string;
	etcAccounts: string[];
	kakaoAccount: string;
	lineAccount: string;
	discordAccount: string;
	country: string;
	city: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}

export interface ArtistCreatePayload {
	stageName: string;
	slug: string;
	description: string;
	profileImageUrl: string;
	instagramAccount?: string;
	youtubeAccount?: string;
	tiktokAccount?: string;
	soundcloudAccount?: string;
	kakaoAccount?: string;
	lineAccount?: string;
	discordAccount?: string;
	etcAccounts?: string[];
	country: string;
	city: string;
}

export interface ArtistUpdatePayload {
	stageName?: string;
	slug?: string;
	description?: string;
	profileImageUrl?: string;
	instagramAccount?: string;
	youtubeAccount?: string;
	tiktokAccount?: string;
	soundcloudAccount?: string;
	kakaoAccount?: string;
	lineAccount?: string;
	discordAccount?: string;
	country?: string;
	city?: string;
}
