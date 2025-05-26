export const USER_NOT_FOUND_ERROR = {
	title: "User not found",
	code: 1000,
	status: 404,
	detail: "사용자를 찾을 수 없습니다.",
};

export const USER_INVALID_PASSWORD_ERROR = {
	title: "Invalid password",
	code: 1001,
	status: 401,
	detail: "비밀번호가 일치하지 않습니다.",
};

export const USER_EMAIL_ALREADY_EXISTS_ERROR = {
	title: "Email already exists",
	code: 1002,
	status: 400,
	detail: "이미 존재하는 이메일입니다.",
};
