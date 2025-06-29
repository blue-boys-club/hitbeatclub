import { z } from "zod";

/**
 * trackIds 만 반환하는 단순 재생목록 응답 (GET /playlists/auto, POST /playlists/manual)
 */
export const PlaylistTracksResponseSchema = z.object({
	trackIds: z.array(z.number().describe("트랙 ID").default(1)).max(100).describe("재생목록 트랙 ID 배열"),
});

/**
 * trackIds 와 currentIndex 를 함께 반환하는 재생목록 응답 (GET /users/me/playlist, PUT /users/me/playlist)
 */
export const PlaylistFullResponseSchema = PlaylistTracksResponseSchema.extend({
	currentIndex: z.number().min(0).max(99).describe("현재 재생 인덱스").default(0),
});

export type PlaylistTracksResponse = z.infer<typeof PlaylistTracksResponseSchema>;
export type PlaylistFullResponse = z.infer<typeof PlaylistFullResponseSchema>;
