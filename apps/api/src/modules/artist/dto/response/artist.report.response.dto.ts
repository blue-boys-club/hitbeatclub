import { createZodDto } from "nestjs-zod";
import { ArtistReportResponseSchema } from "@hitbeatclub/shared-types/artist";

export class ArtistReportResponseDto extends createZodDto(ArtistReportResponseSchema) {}
