import { createZodDto } from "nestjs-zod";
import { AuthLoginPayloadSchema } from "@hitbeatclub/shared-types/auth";

export class AuthLoginDto extends createZodDto(AuthLoginPayloadSchema) {}
