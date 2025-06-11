import { QUERY_KEYS } from "@/apis/query-keys";
import { queryOptions } from "@tanstack/react-query";
import { getArtistContentList, getArtistDetail, getArtistMe } from "../artist.api";
import { ArtistProductListQueryRequest } from "@hitbeatclub/shared-types/artist";

export const getArtistDetailQueryOption = (id: number) => {
	return queryOptions({
		queryKey: QUERY_KEYS.artist.detail(id),
		queryFn: () => getArtistDetail(id),
		select: (response) => response.data,
	});
};

export const getArtistMeQueryOption = () => {
	return queryOptions({
		queryKey: QUERY_KEYS.artist.me,
		queryFn: () => getArtistMe(),
		select: (response) => response.data,
	});
};

export const getArtistProductListQueryOption = (id: number, payload: ArtistProductListQueryRequest) => {
	return queryOptions({
		queryKey: QUERY_KEYS.artist.productList(id, payload),
		queryFn: () => getArtistContentList(id, payload),
		select: (response) => response,
	});
};
