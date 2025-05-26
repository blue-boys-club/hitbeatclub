import { createZodDto } from "nestjs-zod";
import { FileSingleUploadSchema } from "@hitbeatclub/shared-types";

export class FileSingleUploadDto extends createZodDto(FileSingleUploadSchema) {}
