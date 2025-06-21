import { createZodDto } from "nestjs-zod";
import { ArtistReportRequestSchema } from "@hitbeatclub/shared-types/artist";

export class ArtistReportRequestDto extends createZodDto(ArtistReportRequestSchema) {}
