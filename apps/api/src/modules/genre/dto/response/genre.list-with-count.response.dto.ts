import { createZodDto } from "nestjs-zod";
import { GenreWithCountResponseSchema } from "@hitbeatclub/shared-types/genre";

export class GenreListWithCountResponseDto extends createZodDto(GenreWithCountResponseSchema) {}
