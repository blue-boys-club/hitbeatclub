export const FILE_REQUIRED_ERROR = {
	title: "File required",
	code: 1500,
	status: 422,
	detail: "파일이 필수값입니다.",
};

export const FILE_CREATE_ERROR = {
	title: "File create failed",
	code: 1501,
	status: 400,
};

export const FILE_UPDATE_ERROR = {
	title: "File update failed",
	code: 1502,
	status: 400,
};

export const FILE_UPLOAD_PATH_NOT_FOUND_ERROR = {
	title: "Upload path not found",
	code: 1503,
	status: 400,
	detail: "업로드 경로를 찾을 수 없습니다.",
};

export const FILE_NOT_SUPPORTED_ERROR = {
	title: "File not supported",
	code: 1504,
	status: 415,
	detail: "지원하지 않는 파일 형식입니다.",
};

export const FILE_MIME_INVALID_ERROR = {
	title: "File mime invalid",
	code: 1505,
	status: 400,
	detail: "파일 형식이 올바르지 않습니다.",
};

export const FILE_PUT_ITEM_IN_BUCKET_ERROR = {
	title: "Put item in bucket failed",
	code: 1506,
	status: 400,
};

export const FILE_UPDATE_FILE_ENABLED_AND_DELETE_ERROR = {
	title: "Update file enabled and delete failed",
	code: 1507,
	status: 400,
};
