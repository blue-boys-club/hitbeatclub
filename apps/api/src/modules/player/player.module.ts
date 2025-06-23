import { Module } from "@nestjs/common";
import { PlayerController } from "./player.controller";
import { PlayerService } from "./player.service";
import { PrismaModule } from "~/common/prisma/prisma.module";

@Module({
	imports: [PrismaModule],
	controllers: [PlayerController],
	providers: [PlayerService],
	exports: [PlayerService],
})
export class PlayerModule {}
