import { createZodDto } from "nestjs-zod";
import { AuthFindIdResponseSchema } from "@hitbeatclub/shared-types/auth";

export class AuthFindIdResponseDto extends createZodDto(AuthFindIdResponseSchema) {}
