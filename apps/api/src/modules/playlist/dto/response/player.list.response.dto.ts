import { createZodDto } from "nestjs-zod";
import { PlaylistListResponseSchema } from "@hitbeatclub/shared-types";

export class PlaylistListResponseDto extends createZodDto(PlaylistListResponseSchema) {}
