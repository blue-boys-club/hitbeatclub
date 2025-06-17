const noticeMessage = {
	create: {
		success: "공지사항이 생성되었습니다.",
	},
	find: {
		success: "공지사항을 조회했습니다.",
	},
	update: {
		success: "공지사항이 수정되었습니다.",
	},
	delete: {
		success: "공지사항이 삭제되었습니다.",
	},
	fileUpload: {
		success: "공지사항 파일이 업로드되었습니다.",
	},
} as const;

export default noticeMessage;
