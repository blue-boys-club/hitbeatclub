import { createZodDto } from "nestjs-zod";
import { PlayerStartRequestSchema } from "@hitbeatclub/shared-types";

export class PlayerStartRequestDto extends createZodDto(PlayerStartRequestSchema) {}
