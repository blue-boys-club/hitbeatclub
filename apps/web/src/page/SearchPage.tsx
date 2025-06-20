import { Suspense } from "react";
import { SearchArtists } from "../features/search/components/SearchArtists";
// import { SearchDebug } from "../components/SearchDebug";
// import { SearchFilters } from "../features/search/components/SearchFilters";
import SearchFilters from "../features/search/components/SearchFilters";
import { SearchHeader } from "../features/search/components/SearchHeader";
import { SearchTracks } from "../features/search/components/SearchTracks";

export default function SearchPage() {
	return (
		<div className="flex flex-col gap-16px @container/search h-full">
			{/* TODO: Correctly implement Suspense */}
			<Suspense fallback={null}>
				<SearchHeader />

				<SearchFilters />

				{/* <SearchDebug /> */}

				<div className="flex flex-col flex-1 overflow-y-auto gap-16px">
					<SearchArtists />
					<SearchTracks />
				</div>
			</Suspense>
		</div>
	);
}
