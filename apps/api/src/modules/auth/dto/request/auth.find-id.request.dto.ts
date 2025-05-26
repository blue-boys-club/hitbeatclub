import { createZodDto } from "nestjs-zod";
import { AuthFindIdPayloadSchema } from "@hitbeatclub/shared-types/auth";

export class AuthFindIdDto extends createZodDto(AuthFindIdPayloadSchema) {}
