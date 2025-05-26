import { Request } from "express";
import { TokenPayload } from "google-auth-library";

export interface AuthenticatedRequest extends Request {
	user: TokenPayload & {
		id: number;
	};
}
