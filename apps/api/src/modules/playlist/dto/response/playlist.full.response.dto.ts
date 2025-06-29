import { createZodDto } from "nestjs-zod";
import { PlaylistFullResponseSchema } from "@hitbeatclub/shared-types";

export class PlaylistFullResponseDto extends createZodDto(PlaylistFullResponseSchema) {}
