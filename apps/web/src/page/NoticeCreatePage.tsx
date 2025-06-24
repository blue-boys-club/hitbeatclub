"use client";
import { useCreateNoticeMutation } from "@/apis/notice/mutations/useCreateNoticeMutation";
import { NoticeCreateContent, NoticeCreateHeader } from "@/features/notice/components";
import { useRouter } from "next/navigation";
import { useState } from "react";

const NoticeCreatePage = () => {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [uploadedFileIds, setUploadedFileIds] = useState<number[]>([]);
	const router = useRouter();
	const { mutate: createNotice, isPending: isCreating } = useCreateNoticeMutation();

	const handleCreateNotice = () => {
		if (title.trim() === "" || content.trim() === "") {
			alert("제목과 내용을 입력해주세요.");
			return;
		}

		createNotice(
			{ title, content, noticeFileIds: uploadedFileIds },
			{
				onSuccess: () => {
					alert("공지사항이 생성되었습니다.");
					router.push("/notices");
				},
			},
		);
	};

	return (
		<>
			<NoticeCreateHeader
				title={title}
				setTitle={setTitle}
			/>
			<NoticeCreateContent
				content={content}
				setContent={setContent}
				uploadedFileIds={uploadedFileIds}
				setUploadedFileIds={setUploadedFileIds}
				onCreateNotice={handleCreateNotice}
			/>
		</>
	);
};

export default NoticeCreatePage;
