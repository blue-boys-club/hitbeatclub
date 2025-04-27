import ArtistStudioPayoutsPage from "@/features/artist/components/ArtistStudioPayoutPage";

const ArtistStudioReferralsRoute = async ({ params }: { params: Promise<{ artistId: string }> }) => {
	const { artistId } = await params;

	return (
		<ArtistStudioPayoutsPage
			artistId={artistId}
			type="referrals"
		/>
	);
};

export default ArtistStudioReferralsRoute;
