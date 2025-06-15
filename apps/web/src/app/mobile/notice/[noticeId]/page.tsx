import MobileNoticeDetailPage from "@/page/MobileNoticeDetailPage";

const MobileNoticeDetailRoute = async ({ params }: { params: Promise<{ noticeId: string }> }) => {
	const { noticeId } = await params;

	return <MobileNoticeDetailPage noticeId={noticeId} />;
};

export default MobileNoticeDetailRoute;
