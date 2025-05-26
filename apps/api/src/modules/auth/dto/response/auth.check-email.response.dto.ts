import { createZodDto } from "nestjs-zod";
import { AuthCheckEmailResponseSchema } from "@hitbeatclub/shared-types/auth";

export class AuthCheckEmailResponseDto extends createZodDto(AuthCheckEmailResponseSchema) {}
