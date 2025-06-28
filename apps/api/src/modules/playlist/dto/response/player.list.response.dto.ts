import { createZodDto } from "nestjs-zod";
import { PlayerListResponseSchema } from "@hitbeatclub/shared-types";

export class PlayerListResponseDto extends createZodDto(PlayerListResponseSchema) {}
