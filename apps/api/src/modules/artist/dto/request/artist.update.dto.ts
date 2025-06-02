import { createZodDto } from "nestjs-zod";
import { ArtistCreateSchema } from "@hitbeatclub/shared-types/artist";

export class ArtistUpdateDto extends createZodDto(ArtistCreateSchema) {}
