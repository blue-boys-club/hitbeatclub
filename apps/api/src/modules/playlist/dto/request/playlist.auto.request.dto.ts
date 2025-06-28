// import { createZodDto } from "nestjs-zod";
import { PlaylistAutoRequestSchema } from "@hitbeatclub/shared-types";
import { z } from "zod";

// export class PlaylistAutoRequestDto extends createZodDto(PlaylistAutoRequestSchema) {}
export type PlaylistAutoRequestDto = z.infer<typeof PlaylistAutoRequestSchema>;
