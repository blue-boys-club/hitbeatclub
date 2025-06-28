import axiosInstance from "@/apis/api.client";
import { CommonResponseId } from "@hitbeatclub/shared-types/common";
import {
	PlaylistAutoRequest,
	PlaylistManualRequest,
	PlaylistTracksResponse,
	PlaylistFullResponse,
	PlaylistUpdateRequest,
} from "@hitbeatclub/shared-types";

/**
 * 플레이리스트 자동 생성 API
 * @param data 플레이리스트 생성 컨텍스트 정보
 * @returns 플레이리스트 트랙 정보
 */
export const getPlaylistAuto = async (data: PlaylistAutoRequest): Promise<PlaylistTracksResponse> => {
	const response = await axiosInstance.get<PlaylistTracksResponse>(`/playlists/auto`, {
		params: data,
	});
	return response.data;
};

/**
 * 플레이리스트 수동 생성 API
 * @param data 플레이리스트 트랙 정보
 * @returns 플레이리스트 트랙 정보
 */
export const getPlaylistManual = async (data: PlaylistManualRequest): Promise<PlaylistTracksResponse> => {
	const response = await axiosInstance.post<PlaylistTracksResponse>(`/playlists/manual`, data);
	return response.data;
};

/**
 * 내 플레이리스트 조회 API
 * @returns 플레이리스트 정보
 */
export const getPlaylist = async (): Promise<PlaylistFullResponse> => {
	const response = await axiosInstance.get<PlaylistFullResponse>(`/users/me/playlist`);
	return response.data;
};

/**
 * 내 플레이리스트 수정 API
 * @param data 플레이리스트 정보
 * @returns 플레이리스트 정보
 */
export const updatePlaylist = async (data: PlaylistUpdateRequest): Promise<CommonResponseId> => {
	const response = await axiosInstance.put<CommonResponseId>(`/users/me/playlist`, data);
	return response.data;
};
