import { createZodDto } from "nestjs-zod";
import { PaginationRequestSchema } from "@hitbeatclub/shared-types/common";

export class UserLikeProductListRequestDto extends createZodDto(PaginationRequestSchema) {}
