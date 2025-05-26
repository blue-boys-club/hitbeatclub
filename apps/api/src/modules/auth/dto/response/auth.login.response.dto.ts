import { createZodDto } from "nestjs-zod";
import { AuthLoginResponseSchema } from "@hitbeatclub/shared-types/auth";

export class AuthLoginResponseDto extends createZodDto(AuthLoginResponseSchema) {}
