import { CommonResponse } from "@/apis/api.type";

export interface UploadFilePayload {
	type: "NOTICE_FILE";
	file: File;
}

export type UploadFileResponse = CommonResponse<{ id: number; url: string }>;
