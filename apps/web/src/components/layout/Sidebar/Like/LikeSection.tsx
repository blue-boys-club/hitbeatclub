import { memo, useState } from "react";
import { SidebarSearch } from "../SidebarSearch";
import LikeItems from "./LikeItems";

const LikeSection = memo(() => {
	const [search, setSearch] = useState("");
	const [sort, setSort] = useState<"RECENT" | "NAME">("RECENT");

	return (
		<div className="flex flex-col flex-1 h-full overflow-hidden">
			<div className="flex-none hidden @200px/sidebar:block flex-shrink-0 px-2">
				<SidebarSearch
					search={search}
					onSearchChange={setSearch}
					sort={sort}
					onSortChange={setSort}
				/>
			</div>

			<LikeItems
				search={search}
				sort={sort}
			/>
		</div>
	);
});

LikeSection.displayName = "LikeSection";

export default LikeSection;
