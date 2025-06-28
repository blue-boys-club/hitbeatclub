// import { createZodDto } from "nestjs-zod";
import { PlaylistManualRequestSchema } from "@hitbeatclub/shared-types";
import { z } from "zod";

// export class PlaylistManualRequestDto extends createZodDto(PlaylistManualRequestSchema) {}
export type PlaylistManualRequestDto = z.infer<typeof PlaylistManualRequestSchema>;
