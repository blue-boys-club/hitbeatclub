module.exports = {
	extends: ["@hitbeatclub/eslint-config"],
	parserOptions: {
		project: "./tsconfig.json",
		tsconfigRootDir: __dirname,
	},
	rules: {
		// 패키지 특화 규칙이 필요한 경우 여기에 추가
	},
};
