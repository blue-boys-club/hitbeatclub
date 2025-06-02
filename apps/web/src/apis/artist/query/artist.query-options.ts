import { QUERY_KEYS } from "@/apis/query-keys";
import { queryOptions } from "@tanstack/react-query";
import { getArtistDetail, getArtistMe } from "../artist.api";

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
