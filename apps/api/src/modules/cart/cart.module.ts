import { Module } from "@nestjs/common";
import { CartService } from "./cart.service";
import { PrismaModule } from "~/common/prisma/prisma.module";
import { FileModule } from "../file/file.module";

@Module({
	imports: [PrismaModule, FileModule],
	providers: [CartService],
	exports: [CartService],
})
export class CartModule {}
