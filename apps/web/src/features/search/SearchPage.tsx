import { SearchArtists } from "../components/SearchArtists";
// import { SearchDebug } from "../components/SearchDebug";
import { SearchFilters } from "../components/SearchFilters";
import { SearchHeader } from "../components/SearchHeader";
import { SearchTracks } from "../components/SearchTracks";

export default function SearchPage() {
	return (
		<div className="flex flex-col gap-16px @container/search h-full">
			<SearchHeader />

			<SearchFilters />

			{/* <SearchDebug /> */}

			<div className="flex flex-col flex-1 overflow-y-auto gap-16px">
				<SearchArtists />
				<SearchTracks />
			</div>
		</div>
	);
}
