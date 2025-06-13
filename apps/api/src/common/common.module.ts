import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import configs from "~/configs";
import { HelperModule } from "./helper/helper.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
	controllers: [],
	providers: [],
	imports: [
		ConfigModule.forRoot({
			load: configs,
			isGlobal: true,
			cache: true,
			envFilePath: `.env.${process.env.NODE_ENV}`,
			expandVariables: false,
		}),
		HelperModule.forRoot(),
		HelperModule.forRoot(),
		ScheduleModule.forRoot(),
		PrismaModule.forRoot(),
	],
})
export class CommonModule {}
