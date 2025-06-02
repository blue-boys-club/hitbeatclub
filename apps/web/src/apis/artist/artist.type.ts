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

export interface ArtistMeResponse extends ArtistDetailResponse {}

export interface ArtistCreatePayload {
	stageName: string;
	slug: string;
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
