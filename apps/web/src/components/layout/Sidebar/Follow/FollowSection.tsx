import { memo, useState } from "react";
import FollowItems from "./FollowItems";
import { SidebarSearch } from "../SidebarSearch";

const FollowSection = memo(() => {
	const [search, setSearch] = useState("");
	const [sort, setSort] = useState<"recent" | "name">("recent");

	return (
		<div className="flex flex-col flex-1 h-full overflow-y-hidden">
			<div className="flex-none hidden @200px/sidebar:block flex-shrink-0 px-2">
				<SidebarSearch
					search={search}
					onSearchChange={setSearch}
					sort={sort}
					onSortChange={setSort}
				/>
			</div>

			<FollowItems
				search={search}
				sort={sort}
			/>
		</div>
	);
});

FollowSection.displayName = "FollowSection";

export default FollowSection;
