import { Module } from "@nestjs/common";
import { QuestionService } from "./question.service";
import { QuestionPublicController } from "./question.public.controller";

@Module({
	controllers: [QuestionPublicController],
	providers: [QuestionService],
	exports: [QuestionService],
})
export class QuestionModule {}
