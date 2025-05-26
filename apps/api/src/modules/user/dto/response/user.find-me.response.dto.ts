import { UserUpdatePayloadSchema } from "@hitbeatclub/shared-types/user";
import { createZodDto } from "nestjs-zod";

export class UserFindMeResponseDto extends createZodDto(UserUpdatePayloadSchema) {}
