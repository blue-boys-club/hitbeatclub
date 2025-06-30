import { QUERY_KEYS } from "@/apis/query-keys";
import { getPlaylist, getPlaylistAuto, getPlaylistManual, getRecentPlaylist } from "../playlist.api";
import { queryOptions } from "@tanstack/react-query";
import { PlaylistAutoRequest, PlaylistManualRequest } from "@hitbeatclub/shared-types";

/**
 * 유저 플레이리스트 목록 조회 옵션
 * @returns 플레이리스트 목록 조회 옵션
 */
export const userPlaylistQueryOptions = queryOptions({
	queryKey: [QUERY_KEYS.playlist.userPlaylist],
	queryFn: getPlaylist,
});

/**
 * 플레이리스트 자동 생성 조회 옵션
 * @param data 플레이리스트 생성 컨텍스트 정보
 * @returns 플레이리스트 트랙 정보
 */
export const playlistAutoQueryOptions = (data: PlaylistAutoRequest) =>
	queryOptions({
		queryKey: [QUERY_KEYS.playlist.auto(data)],
		queryFn: () => getPlaylistAuto(data),
	});

/**
 * 플레이리스트 수동 생성 조회 옵션
 * @param data 플레이리스트 트랙 정보
 * @returns 플레이리스트 트랙 정보
 */
export const playlistManualQueryOptions = (data: PlaylistManualRequest) =>
	queryOptions({
		queryKey: [QUERY_KEYS.playlist.manual(data)],
		queryFn: () => getPlaylistManual(data),
	});

/**
 * 최근 플레이리스트 조회 옵션
 * @returns 최근 플레이리스트 정보
 */
export const playlistRecentQueryOptions = () =>
	queryOptions({
		queryKey: [QUERY_KEYS.playlist.recent],
		queryFn: getRecentPlaylist,
	});
