import { EmailSendPayloadSchema } from "./email.type";
import { z } from "zod";
import axiosInstance from "@/apis/api.client";
import { CommonResponseId } from "@hitbeatclub/shared-types";

export const sendEmail = async (payload: z.input<typeof EmailSendPayloadSchema>) => {
	const parsed = EmailSendPayloadSchema.parse(payload);
	const response = await axiosInstance.post<CommonResponseId>(`/email`, parsed);
	return response.data;
};
