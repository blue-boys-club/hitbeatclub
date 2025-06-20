export const ARTIST_NOT_FOUND_ERROR = {
	title: "Artist not found",
	code: 1300,
	status: 404,
	detail: "아티스트를 찾을 수 없습니다.",
};

export const ARTIST_ALREADY_BLOCKED_ERROR = {
	title: "Artist already blocked",
	code: 1301,
	status: 400,
	detail: "이미 차단된 아티스트입니다.",
};

export const ARTIST_NOT_BLOCKED_ERROR = {
	title: "Artist not blocked",
	code: 1302,
	status: 400,
	detail: "차단되지 않은 아티스트입니다.",
};

export const ARTIST_SELF_BLOCK_ERROR = {
	title: "Cannot block yourself",
	code: 1303,
	status: 400,
	detail: "자기 자신을 차단할 수 없습니다.",
};

export const ARTIST_REPORT_FAILED_ERROR = {
	title: "Artist report failed",
	code: 1304,
	status: 400,
	detail: "아티스트 신고에 실패했습니다.",
};

export const ARTIST_REPORT_NOT_FOUND_ERROR = {
	title: "Artist report not found",
	code: 1305,
	status: 404,
	detail: "신고 내역을 찾을 수 없습니다.",
};
