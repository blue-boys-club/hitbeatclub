export const TAG_NOT_FOUND_ERROR = {
	title: "Tag not found",
	code: 2500,
	status: 404,
	detail: "태그를 찾을 수 없습니다.",
};

export const TAG_MAX_COUNT_ERROR = {
	title: "Tag max count",
	code: 2501,
	status: 400,
	detail: "태그는 최대 5개까지 생성할 수 있습니다.",
};

export const TAG_CREATE_ERROR = {
	title: "Tag create error",
	code: 2502,
	status: 400,
};

export const TAG_ALREADY_EXISTS_ERROR = {
	title: "Tag already exists",
	code: 2503,
	status: 400,
	detail: "이미 존재하는 태그입니다.",
};
