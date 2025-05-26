export interface AuthResponse {
	userId: number;
	accessToken: string;
	refreshToken: string;
	email: string;
	name: string;
	// workspaceId: number;
	role: "USER" | "ADMIN";
	profileBgKey: string;
}
