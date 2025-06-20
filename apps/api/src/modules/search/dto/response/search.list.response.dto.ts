import { createZodDto } from "nestjs-zod";
import { SearchResultResponseSchema } from "@hitbeatclub/shared-types/search";

export class SearchResultResponseDto extends createZodDto(SearchResultResponseSchema) {}
