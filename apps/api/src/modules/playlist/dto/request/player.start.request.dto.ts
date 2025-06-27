import { createZodDto } from "nestjs-zod";
import { PlaylistStartRequestSchema } from "@hitbeatclub/shared-types";

export class PlaylistStartRequestDto extends createZodDto(PlaylistStartRequestSchema) {}
