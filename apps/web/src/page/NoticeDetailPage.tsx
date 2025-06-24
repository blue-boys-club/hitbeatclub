"use client";
import { useNoticeDetailQueryOptions } from "@/apis/notice/query/notice.query-option";
import { NoticeDetailHeader, NoticeDetailContent } from "@/features/notice/components";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useDeleteNoticeMutation } from "@/apis/notice/mutations/useDeleteNoticeMutation";
import { useRouter } from "next/navigation";

const NoticeDetailPage = () => {
	const router = useRouter();
	const { noticeId } = useParams();
	const { data, isPending, isError } = useQuery(useNoticeDetailQueryOptions(noticeId as string));
	const { mutate: deleteNotice } = useDeleteNoticeMutation();
	if (isPending || isError) return <></>;
	return (
		<>
			<NoticeDetailHeader data={data} />
			<NoticeDetailContent
				data={data}
				onDelete={() => {
					deleteNotice(noticeId as string);
					router.push("/notices");
				}}
			/>
		</>
	);
};

export default NoticeDetailPage;
