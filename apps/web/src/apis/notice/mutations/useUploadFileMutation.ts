import { useMutation } from "@tanstack/react-query";
import { uploadFile } from "../notice.api";
import { UploadFilePayload } from "../notice.type";

export const useUploadFileMutation = () => {
	return useMutation({
		mutationFn: (payload: UploadFilePayload) => uploadFile(payload),
	});
};
