import { createZodDto } from "nestjs-zod";
import { UserFollowArtistResponseSchema } from "@hitbeatclub/shared-types/user";

export class UserFollowArtistResponseDto extends createZodDto(UserFollowArtistResponseSchema) {}
