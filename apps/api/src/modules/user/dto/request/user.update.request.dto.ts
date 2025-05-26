import { createZodDto } from "nestjs-zod";
import { UserUpdatePayloadSchema } from "@hitbeatclub/shared-types/user";

export class UserUpdateDto extends createZodDto(UserUpdatePayloadSchema) {}
