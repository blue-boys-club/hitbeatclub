import { createZodDto } from "nestjs-zod";
import { FileUploadResponseSchema } from "@hitbeatclub/shared-types";

export class FileUploadResponseDto extends createZodDto(FileUploadResponseSchema) {}
