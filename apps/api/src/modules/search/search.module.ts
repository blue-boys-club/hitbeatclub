import { forwardRef, Module } from "@nestjs/common";
import { ArtistModule } from "../artist/artist.module";
import { ProductModule } from "../product/product.module";
import { SearchController } from "./search.controller";
// import { SearchService } from "./search.service";

@Module({
	imports: [ProductModule, ArtistModule],
	controllers: [SearchController],
	// providers: [SearchService],
	// exports: [SearchService],
})
export class SearchModule {}
