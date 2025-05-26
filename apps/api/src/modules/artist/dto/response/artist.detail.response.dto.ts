import { createZodDto } from "nestjs-zod";
import { ArtistResponseSchema } from "@hitbeatclub/shared-types/artist";

export class ArtistDetailResponseDto extends createZodDto(ArtistResponseSchema) {}
