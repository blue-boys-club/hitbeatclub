import { createZodDto } from "nestjs-zod";
import { PlaylistRecentResponseSchema } from "@hitbeatclub/shared-types";

export class PlaylistRecentResponseDto extends createZodDto(PlaylistRecentResponseSchema) {}
