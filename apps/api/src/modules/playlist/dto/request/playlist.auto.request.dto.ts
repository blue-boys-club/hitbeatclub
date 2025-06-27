import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const PlaylistAutoRequestSchema = z.object({});

export class PlaylistAutoRequestDto extends createZodDto(PlaylistAutoRequestSchema) {}
