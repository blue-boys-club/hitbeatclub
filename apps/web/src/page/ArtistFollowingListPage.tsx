"use client";

import React, { useState } from "react";
import ArtistHeader from "@/features/artist/components/ArtistHeader";
import ArtistSearchBar from "@/features/artist/components/ArtistSearchBar";
import ArtistCardSection from "@/features/artist/components/ArtistCardSection";
import { SortOption } from "@/features/artist/artist.types";
import { ViewType } from "@/features/artist/artist.types";
import { useSearchParams } from "next/navigation";

const artists = [
	{
		id: "1",
		name: "John Doe",
		image: "/",
		followers: 100,
		isFollowing: true,
	},
	{
		id: "2",
		name: "Jane Doe",
		image: "/",
		followers: 200,
		isFollowing: false,
	},
	{
		id: "3",
		name: "John Doe",
		image: "/",
		followers: 100,
		isFollowing: true,
	},
	{
		id: "4",
		name: "Jane Doe",
		image: "/",
		followers: 200,
		isFollowing: false,
	},
];

const ArtistFollowingListPage = ({ view }: { view: string }) => {
	const [activeView, setActiveView] = useState<ViewType>(view as ViewType);
	const [selectedSort, setSelectedSort] = useState<SortOption>("Recent");
	const [searchValue, setSearchValue] = useState("");

	return (
		<>
			<ArtistHeader />
			<ArtistSearchBar
				selectedSort={selectedSort}
				setSelectedSort={setSelectedSort}
				searchValue={searchValue}
				setSearchValue={setSearchValue}
				activeView={activeView}
				setActiveView={setActiveView}
			/>
			<ArtistCardSection
				artists={artists}
				activeView={activeView}
			/>
		</>
	);
};

export default ArtistFollowingListPage;
