import { createZodDto } from "nestjs-zod";
import { ArtistStatisticsResponseSchema } from "@hitbeatclub/shared-types/artist";

export class ArtistStatisticsResponseDto extends createZodDto(ArtistStatisticsResponseSchema) {}
