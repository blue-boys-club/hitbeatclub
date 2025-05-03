import ArtistStudioPayoutDashboard from "@/features/artist-studio/payout/components/ArtistStudioPayoutDashboard";
import ArtistStudioPayoutHeader from "@/features/artist-studio/payout/components/ArtistStudioPayoutHeader";
import ArtistStudioPayoutTable from "@/features/artist-studio/payout/components/ArtistStudioPayoutTable";
import React from "react";

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
