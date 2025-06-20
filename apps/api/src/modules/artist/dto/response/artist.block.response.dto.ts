import { createZodDto } from "nestjs-zod";
import { ArtistBlockResponseSchema } from "@hitbeatclub/shared-types/artist";

export class ArtistBlockResponseDto extends createZodDto(ArtistBlockResponseSchema) {}
