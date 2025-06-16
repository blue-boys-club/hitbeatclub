import { createZodDto } from "nestjs-zod";
import { UserFollowArtistListRequestSchema } from "@hitbeatclub/shared-types/user";

export class UserFollowArtistListRequestDto extends createZodDto(UserFollowArtistListRequestSchema) {}
