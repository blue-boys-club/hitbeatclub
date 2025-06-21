"use client";

import React, { useState, useEffect } from "react";
import { NoticeEditContent, NoticeEditHeader } from "@/features/notice/components";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useNoticeDetailQueryOptions } from "@/apis/notice/query/notice.query-option";
import { useDeleteNoticeMutation } from "@/apis/notice/mutations/useDeleteNoticeMutation";
import { useUpdateNoticeMutation } from "@/apis/notice/mutations/useUpdateNoticeMutation";

const NoticeEditPage = () => {
	const { noticeId } = useParams();
	const router = useRouter();
	const { data, isPending, isError } = useQuery(useNoticeDetailQueryOptions(noticeId as string));
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [uploadedFileIds, setUploadedFileIds] = useState<number[]>([]);
	const { mutate: updateNotice, isSuccess } = useUpdateNoticeMutation(noticeId as string);
	console.log(uploadedFileIds);
	useEffect(() => {
		if (data?.data) {
			setTitle(data.data.title);
			setContent(data.data.content);
		}
	}, [data]);

	useEffect(() => {
		if (isSuccess) {
			router.push(`/notices/${noticeId}`);
		}
	}, [isSuccess]);

	if (isPending || isError) return <></>;
	return (
		<>
			<NoticeEditHeader
				title={title}
				setTitle={setTitle}
			/>
			<NoticeEditContent
				data={data.data}
				content={content}
				setContent={setContent}
				uploadedFileIds={uploadedFileIds}
				setUploadedFileIds={setUploadedFileIds}
				onUpdate={() => updateNotice({ title, content, noticeFileIds: uploadedFileIds })}
			/>
		</>
	);
};

export default NoticeEditPage;
