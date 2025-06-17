import { createZodDto } from "nestjs-zod";
import { UserProfileUpdatePayloadSchema } from "@hitbeatclub/shared-types/user";

export class UserProfileUpdateDto extends createZodDto(UserProfileUpdatePayloadSchema) {}
