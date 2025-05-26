import { createZodDto } from "nestjs-zod";
import { ArtistUpdateSchema } from "@hitbeatclub/shared-types/artist";

export class ArtistUpdateDto extends createZodDto(ArtistUpdateSchema) {}
