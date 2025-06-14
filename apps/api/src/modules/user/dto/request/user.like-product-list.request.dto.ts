import { createZodDto } from "nestjs-zod";
import { UserLikeProductListRequestSchema } from "@hitbeatclub/shared-types/user";

export class UserLikeProductListRequestDto extends createZodDto(UserLikeProductListRequestSchema) {}
