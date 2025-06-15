import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { ProductModule } from "../product/product.module";
import { CartModule } from "../cart/cart.module";
@Module({
	imports: [ProductModule, CartModule],
	providers: [UserService],
	controllers: [UserController],
	exports: [UserService],
})
export class UserModule {}
