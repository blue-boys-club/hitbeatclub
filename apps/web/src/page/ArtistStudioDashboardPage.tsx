import React from "react";
import ArtistStudioDashboardContentList from "@/features/artist-studio/components/dashboard/ArtistStudioDashboardContentList";
import ArtistStudioDashboardHeader from "@/features/artist-studio/components/dashboard/ArtistStudioDashboardHeader";
import ArtistStudioDashboardInfo from "@/features/artist-studio/components/dashboard/ArtistStudioDashboardInfo";
import ArtistStudioDashboardStatistics from "@/features/artist-studio/components/dashboard/ArtistStudioDashboardStatistics";

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
