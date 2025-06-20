import { createZodDto } from "nestjs-zod";
import { ArtistReportListResponseSchema } from "@hitbeatclub/shared-types/artist";

export class ArtistReportListResponseDto extends createZodDto(ArtistReportListResponseSchema) {}
