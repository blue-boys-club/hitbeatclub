import { createZodDto } from "nestjs-zod";
import { ArtistCreateSchema } from "@hitbeatclub/shared-types/artist";

export class ArtistCreateDto extends createZodDto(ArtistCreateSchema) {}
