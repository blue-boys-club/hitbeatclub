import { createZodDto } from "nestjs-zod";
import { FileSingleProductUploadSchema } from "@hitbeatclub/shared-types/file";

export class FileUrlRequestDto extends createZodDto(FileSingleProductUploadSchema) {}
