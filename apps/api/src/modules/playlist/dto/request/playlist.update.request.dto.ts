import { createZodDto } from "nestjs-zod";
import { PlaylistUpdateRequestSchema } from "@hitbeatclub/shared-types";

export class PlaylistUpdateRequestDto extends createZodDto(PlaylistUpdateRequestSchema) {}
