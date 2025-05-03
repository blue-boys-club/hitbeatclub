import ArtistStudioDashboardContentList from "@/features/artist-studio/dashboard/components/ArtistStudioDashboardContentList";
import ArtistStudioDashboardHeader from "@/features/artist-studio/dashboard/components/ArtistStudioDashboardHeader";
import ArtistStudioDashboardInfo from "@/features/artist-studio/dashboard/components/ArtistStudioDashboardInfo";
import ArtistStudioDashboardStatistics from "@/features/artist-studio/dashboard/components/ArtistStudioDashboardStatistics";
import React from "react";

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
