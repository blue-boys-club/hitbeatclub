import { z } from "zod";
import { ProductSearchQuerySchema } from "../product";
import { ArtistProductListQuerySchema } from "../artist";
import { UserFollowArtistListRequestSchema, UserLikeProductListRequestSchema } from "../user";

export const PlaylistAutoRequestSchema = z.discriminatedUnion("type", [
	z.object({
		type: z.literal("MAIN"),
		category: z.enum(["ALL", "BEAT", "ACAPELLA", "RECOMMEND", "RECENT"]),
	}),
	z.object({
		type: z.literal("SEARCH"),
		query: ProductSearchQuerySchema.omit({
			page: true,
			limit: true,
		}),
	}),
	z.object({
		type: z.literal("ARTIST"),
		artistId: z.coerce.number(),
		query: ArtistProductListQuerySchema.extend({
			isPublic: z.literal(true),
		}).omit({}),
	}),
	z.object({
		type: z.literal("FOLLOWING"),
		query: UserFollowArtistListRequestSchema.omit({
			page: true,
			limit: true,
		}),
	}),
	z.object({
		type: z.literal("LIKED"),
		query: UserLikeProductListRequestSchema.omit({
			page: true,
			limit: true,
		}),
	}),
	z.object({
		type: z.literal("CART"),
	}),
	// z.object({
	// 	type: z.literal("MANUAL"),
	// 	trackIds: z.array(z.coerce.number()),
	// }),
]);

export type PlaylistAutoRequest = z.infer<typeof PlaylistAutoRequestSchema>;

export const PlaylistManualRequestSchema = z.object({
	trackIds: z.array(z.coerce.number()),
});

export type PlaylistManualRequest = z.infer<typeof PlaylistManualRequestSchema>;
