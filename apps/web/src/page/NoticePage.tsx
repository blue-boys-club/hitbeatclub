import { NoticeHeader } from "@/features/notice/components/NoticeHeader";
import { NoticeSearchBar } from "@/features/notice/components/NoticeSearchBar";
import { NoticeList } from "@/features/notice/components/NoticeList";

const NoticePage = () => {
	return (
		<>
			<NoticeHeader />
			<NoticeSearchBar />
			<NoticeList />
		</>
	);
};

export default NoticePage;
