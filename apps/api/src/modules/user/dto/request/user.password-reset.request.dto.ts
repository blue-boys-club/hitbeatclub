import { createZodDto } from "nestjs-zod";
import { UserPasswordResetPayloadSchema } from "@hitbeatclub/shared-types/user";

export class UserPasswordResetDto extends createZodDto(UserPasswordResetPayloadSchema) {}
