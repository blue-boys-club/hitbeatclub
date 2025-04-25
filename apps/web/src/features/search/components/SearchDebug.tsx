"use client";

import { useSearchParametersStates } from "../hooks/useSearchParameters";

export const SearchDebug = () => {
	const [search] = useSearchParametersStates();
	return <div>{JSON.stringify(search, null, 2)}</div>;
};
