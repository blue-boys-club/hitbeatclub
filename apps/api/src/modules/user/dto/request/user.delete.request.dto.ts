import { createZodDto } from "nestjs-zod";
import { UserDeletePayloadSchema } from "@hitbeatclub/shared-types/user";

export class UserDeleteDto extends createZodDto(UserDeletePayloadSchema) {}
