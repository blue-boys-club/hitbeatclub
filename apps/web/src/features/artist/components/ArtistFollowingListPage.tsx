"use client";
import React, { useState } from "react";
import ArtistHeader from "./ArtistHeader";
import ArtistSearchBar from "./ArtistSearchBar";
import ArtistCardSection from "./ArtistCardSection";
import { SortOption, ViewType } from "../artist.types";

const artists = [
	{
		id: 1,
		name: "John Doe",
		image: "/",
		followers: 100,
		isFollowing: true,
	},
	{
		id: 2,
		name: "Jane Doe",
		image: "/",
		followers: 200,
		isFollowing: false,
	},
	{
		id: 3,
		name: "John Doe",
		image: "/",
		followers: 100,
		isFollowing: true,
	},
	{
		id: 4,
		name: "Jane Doe",
		image: "/",
		followers: 200,
		isFollowing: false,
	},
];

const ArtistFollowingListPage = () => {
	const [activeView, setActiveView] = useState<ViewType>("grid");
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
