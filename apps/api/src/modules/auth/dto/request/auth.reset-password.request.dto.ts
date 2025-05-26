import { createZodDto } from "nestjs-zod";
import { AuthResetPasswordPayloadSchema } from "@hitbeatclub/shared-types/auth";

export class AuthResetPasswordRequestDto extends createZodDto(AuthResetPasswordPayloadSchema) {}
