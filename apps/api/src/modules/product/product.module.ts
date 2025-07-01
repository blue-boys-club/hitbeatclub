import { forwardRef, Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { FileModule } from "../file/file.module";
import { PrismaModule } from "~/common/prisma/prisma.module";
import { TagModule } from "../tag/tag.module";
import { GenreModule } from "../genre/genre.module";
import { ArtistModule } from "../artist/artist.module";
import { PaymentModule } from "../payment/payment.module";
import { AwsModule } from "~/common/aws/aws.module";
import { PlaylistModule } from "../playlist/playlist.module";

@Module({
	imports: [
		FileModule,
		PrismaModule,
		TagModule,
		GenreModule,
		AwsModule,
		forwardRef(() => ArtistModule),
		forwardRef(() => PaymentModule),
		forwardRef(() => PlaylistModule),
	],
	controllers: [ProductController],
	providers: [ProductService],
	exports: [ProductService],
})
export class ProductModule {}
