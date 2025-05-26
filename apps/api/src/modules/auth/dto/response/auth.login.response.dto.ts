import { createZodDto } from "nestjs-zod";
import { AuthGoogleLoginResponseSchema } from "@hitbeatclub/shared-types/auth";

export class AuthLoginResponseDto extends createZodDto(AuthGoogleLoginResponseSchema) {}
