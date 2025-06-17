export interface UpdateCartItemPayload {
	id: number;
	licenseId: number;
}

export interface UserFollowedArtistListPayload {
	page?: number;
	limit?: number;
	search?: string;
	sort?: string;
}
