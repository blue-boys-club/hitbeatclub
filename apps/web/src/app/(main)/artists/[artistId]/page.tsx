import ArtistProductListPage from "@/page/ArtistProductListPage";

const ArtistDetailPage = async ({ params }: { params: Promise<{ artistId: string }> }) => {
	const { artistId } = await params;
	return <ArtistProductListPage slug={artistId} />;
};

export default ArtistDetailPage;
