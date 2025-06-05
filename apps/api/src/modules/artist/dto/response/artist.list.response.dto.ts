import { createZodDto } from "nestjs-zod";
import { ArtistListResponseSchema } from "@hitbeatclub/shared-types/artist";

export class ArtistListResponseDto extends createZodDto(ArtistListResponseSchema) {}
