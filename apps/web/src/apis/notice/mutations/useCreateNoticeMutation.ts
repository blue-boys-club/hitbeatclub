import { useMutation } from "@tanstack/react-query";
import { createNotice } from "../notice.api";
import { NoticeCreateRequest } from "@hitbeatclub/shared-types";

export const useCreateNoticeMutation = () => {
	return useMutation({
		mutationFn: (payload: NoticeCreateRequest) => createNotice(payload),
	});
};
