import { createZodDto } from "nestjs-zod";
import { UserUpdatePayloadSchema } from "@hitbeatclub/shared-types/user";

export class UserJoinDto extends createZodDto(UserUpdatePayloadSchema) {}
