/**
 * 사용자 정보 응답 인터페이스
 */
export interface UserMeResponse {
	/**
	 * 사용자 이름
	 * @example '홍길동'
	 */
	name: string;

	/**
	 * 전화번호
	 * @example '01012345678'
	 */
	phoneNumber: string;

	/**
	 * 성별
	 * @example 'M'
	 */
	gender: "M" | "F";

	/**
	 * 생년월일
	 * @example '2024-01-01T00:00:00Z'
	 */
	birthDate: string;

	/**
	 * profile photo url
	 * @example 'https://example.com/profile.jpg'
	 */
	profileUrl: string;

	/**
	 * 국가
	 * @example 'KR'
	 */
	country: string;

	/**
	 * 지역
	 * @example 'Seoul'
	 */
	region: string;

	/**
	 * 약관 동의
	 * @example 1 (boolean)
	 */
	isAgreedTerms: number;

	/**
	 * privacy policy 동의
	 * @example 1 (boolean)
	 */
	isAgreedPrivacyPolicy: number;

	/**
	 * email 동의
	 * @example 1 (boolean)
	 */
	isAgreedEmail: number;
}

// export interface UpdateUserRequest {
// 	name: string;
// 	job: string;
// 	profilePhotoId?: number;
// 	profileBgKey: string;
// }

// export interface UploadUserPhotoRequest {
// 	userId: number;
// 	file: Blob | File;
// }

// export interface UploadUserPhotoResponse {
// 	id: number;
// 	url: string;
// }

// export interface UserResponse {
// 	id: number;
// 	name: string;
// 	profileUrl: string;
// }
