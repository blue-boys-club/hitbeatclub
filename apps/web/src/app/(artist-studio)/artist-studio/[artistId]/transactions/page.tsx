import ArtistStudioPayoutsPage from "@/page/ArtistStudioPayoutPage";
const ArtistStudioTransactionsRoute = async ({ params }: { params: Promise<{ artistId: string }> }) => {
	const { artistId } = await params;

	return (
		<ArtistStudioPayoutsPage
			artistId={artistId}
			type="transactions"
		/>
	);
};

export default ArtistStudioTransactionsRoute;
