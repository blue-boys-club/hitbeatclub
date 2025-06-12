import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { FileModule } from "../file/file.module";
import { PrismaModule } from "src/common/prisma/prisma.module";
import { TagModule } from "../tag/tag.module";
import { GenreModule } from "../genre/genre.module";

@Module({
	imports: [FileModule, PrismaModule, TagModule, GenreModule],
	controllers: [ProductController],
	providers: [ProductService],
	exports: [ProductService],
})
export class ProductModule {}
