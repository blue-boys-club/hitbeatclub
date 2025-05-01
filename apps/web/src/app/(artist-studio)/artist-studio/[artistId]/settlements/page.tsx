import ArtistStudioPayoutsPage from "@/page/ArtistStudioPayoutPage";

const ArtistStudioSettlementsRoute = async ({ params }: { params: Promise<{ artistId: string }> }) => {
	const { artistId } = await params;

	return (
		<ArtistStudioPayoutsPage
			artistId={artistId}
			type="settlements"
		/>
	);
};

export default ArtistStudioSettlementsRoute;
