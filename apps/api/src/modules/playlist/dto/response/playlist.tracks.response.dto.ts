import { createZodDto } from "nestjs-zod";
import { PlaylistTracksResponseSchema } from "@hitbeatclub/shared-types";

export class PlaylistTracksResponseDto extends createZodDto(PlaylistTracksResponseSchema) {}
