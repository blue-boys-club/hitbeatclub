import React from "react";
import ArtistStudioPayoutHeader from "./ArtistStudioPayoutHeader";
import ArtistStudioPayoutDashboard from "./ArtistStudioPayoutDashboard";
import ArtistStudioPayoutTable from "./ArtistStudioPayoutTable";

interface ArtistStudioPayoutsPageProps {
	artistId: string;
	type: "settlements" | "referrals" | "transactions";
}

const ArtistStudioPayoutsPage = ({ artistId, type }: ArtistStudioPayoutsPageProps) => {
	return (
		<main className="border-r-2 mr-23px pr-16px pl-12px border-hbc-black">
			<ArtistStudioPayoutHeader />
			<ArtistStudioPayoutDashboard artistId={artistId} />
			<ArtistStudioPayoutTable
				artistId={artistId}
				type={type}
			/>
		</main>
	);
};

export default ArtistStudioPayoutsPage;
