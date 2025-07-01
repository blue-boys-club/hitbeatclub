import { forwardRef, Module } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { PrismaModule } from "~/common/prisma/prisma.module";
import { CartModule } from "../cart/cart.module";
import { FileModule } from "../file/file.module";
import { SubscribeModule } from "../subscribe/subscribe.module";
import { ProductModule } from "../product/product.module";
import { ExchangeRateModule } from "../exchange-rate/exchange-rate.module";

@Module({
	imports: [
		PrismaModule,
		CartModule,
		FileModule,
		forwardRef(() => ProductModule),
		forwardRef(() => SubscribeModule),
		ExchangeRateModule,
	],
	providers: [PaymentService],
	controllers: [PaymentController],
	exports: [PaymentService],
})
export class PaymentModule {}
