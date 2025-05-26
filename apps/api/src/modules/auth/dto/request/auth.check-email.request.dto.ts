import { createZodDto } from "nestjs-zod";
import { AuthCheckEmailRequestSchema } from "@hitbeatclub/shared-types/auth";

export class AuthCheckEmailRequestDto extends createZodDto(AuthCheckEmailRequestSchema) {}
