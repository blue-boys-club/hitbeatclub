export interface IAuthHash {
	salt?: string;
	hash?: string;
	expired?: Date;
	hashCreated?: Date;
}

export interface IAuthKakaoTokenResponse {
	access_token: string;
	token_type: string;
	refresh_token: string;
	id_token: string;
	expires_in: number;
	scope: string;
	refresh_token_expires_in: number;
}

export interface IAuthKakaoUserInfoResponse {
	id: number;
	connected_at: string;
	kakao_account: {
		has_email: boolean;
		email_needs_agreement: boolean;
		is_email_valid: boolean;
		is_email_verified: boolean;
		email: string;
	};
}

export interface IAuthNaverTokenResponse {
	access_token: string;
	refresh_token: string;
	token_type: string;
	expires_in: number;
}

export interface IAuthNaverUserInfoResponse {
	/** API 호출 결과 코드 */
	resultcode: string;
	/** 호출 결과 메시지 */
	message: string;
	response: {
		/** 동일인 식별 정보 (애플리케이션당 유니크한 일련번호) */
		id: string;
		/** 사용자 별명 */
		nickname: string;
		/** 사용자 이름 */
		name: string;
		/** 사용자 메일 주소 */
		email: string;
		/** 성별 (F: 여성, M: 남성, U: 확인불가) */
		gender: "F" | "M" | "U";
		/** 사용자 연령대 */
		age: string;
		/** 사용자 생일 (MM-DD 형식) */
		birthday: string;
		/** 사용자 프로필 사진 URL */
		profile_image: string;
		/** 출생연도 */
		birthyear: string;
		/** 휴대전화번호 */
		mobile: string;
	};
}
