import { createZodDto } from "nestjs-zod";
import { ArtistProductListQuerySchema } from "@hitbeatclub/shared-types/artist";

export class ArtistProductListQueryRequestDto extends createZodDto(ArtistProductListQuerySchema) {}
