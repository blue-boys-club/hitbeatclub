import ArtistFollowingListPage from "@/page/ArtistFollowingListPage";
const FollowArtistListRoute = async ({ searchParams }: { searchParams: Promise<{ view: string }> }) => {
	const { view } = await searchParams;

	return <ArtistFollowingListPage view={view} />;
};

export default FollowArtistListRoute;
