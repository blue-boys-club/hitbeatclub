import { createZodDto } from "nestjs-zod";
import { UserFollowArtistListResponseSchema } from "@hitbeatclub/shared-types/user";

export class UserFollowArtistListResponseDto extends createZodDto(UserFollowArtistListResponseSchema) {}
