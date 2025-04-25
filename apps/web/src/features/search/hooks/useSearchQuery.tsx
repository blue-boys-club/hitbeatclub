import { queryOptions } from "@tanstack/react-query";
import { useSearchParametersStates } from "./useSearchParameters";

export const useSearchQueryOptions = () => {
	const [searchParameters] = useSearchParametersStates();
	// const urlParameters = Object.entries(searchParameters)
	// 	.map(([key, value]) => `${key}=${value}`)
	// 	.join("&");

	// TODO: USE GET QUERY OPTIONS
	return queryOptions({
		queryKey: ["search", "items", searchParameters],
		queryFn: () => {
			// return fetch(`/api/search?${urlParameters}`).then((res) => res.json());
			return Promise.resolve({
				artists: Array.from({ length: 10 }, (_, index) => ({
					id: index,
					name: `Artist ${index + 1}`,
					image: `https://placehold.co/180x180.png`,
				})),
				tracks: Array.from({ length: 10 }, (_, index) => ({
					id: index,
					title: `Track ${index + 1}`,
					artist: `Artist ${index + 1}`,
					albumCoverUrl: `https://placehold.co/180x180.png`,
				})),

				total: 325,
			});
		},
	});
};

export const useTagSearchQueryOptions = (value: string) => {
	return queryOptions({
		queryKey: ["search", "tags", value],
		queryFn: () => {
			return Promise.resolve([
				{
					id: 1,
					name: `Tag ${value} 1`,
				},
				{
					id: 2,
					name: `Tag ${value} 2`,
				},
			]);
		},
	});
};
