import { useMutation } from "@tanstack/react-query";
import { createNotice } from "../notice.api";
import { NoticeCreatePayload } from "../notice.type";

export const useCreateNoticeMutation = () => {
	return useMutation({
		mutationFn: (payload: NoticeCreatePayload) => createNotice(payload),
	});
};
