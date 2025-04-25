import React from "react";
import ArtistStudioDashboardHeader from "./ArtistStudioDashboardHeader";
import ArtistStudioDashboardInfo from "./ArtistStudioDashboardInfo";
import ArtistStudioDashboardStatistics from "./ArtistStudioDashboardStatistics";
import ArtistStudioDashboardContentList from "./ArtistStudioDashboardContentList";

const ArtistStudioDashboardPage = () => {
	return (
		<main className="pl-4 pr-10">
			<ArtistStudioDashboardHeader />
			<ArtistStudioDashboardInfo />
			<ArtistStudioDashboardStatistics />
			<ArtistStudioDashboardContentList />
		</main>
	);
};

export default ArtistStudioDashboardPage;
