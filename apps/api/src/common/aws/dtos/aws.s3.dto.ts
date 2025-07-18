import { faker } from "@faker-js/faker";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class AwsS3Dto {
	@ApiProperty({
		required: true,
		nullable: false,
	})
	@Type(() => String)
	bucket: string;

	@ApiProperty({
		required: true,
		nullable: false,
		example: faker.system.directoryPath(),
	})
	@Type(() => String)
	path: string;

	@ApiProperty({
		required: true,
		nullable: false,
		example: faker.system.filePath(),
	})
	@Type(() => String)
	pathWithFilename: string;

	@ApiProperty({
		required: false,
		nullable: false,
		example: faker.system.fileName(),
	})
	@Type(() => String)
	originFilename?: string;

	@ApiProperty({
		required: true,
		nullable: false,
		example: faker.system.fileName(),
	})
	@Type(() => String)
	filename: string;

	@ApiProperty({
		required: true,
		nullable: false,
		example: `${faker.internet.url()}/${faker.system.filePath()}`,
	})
	@Type(() => String)
	url: string;

	@ApiProperty({
		required: true,
		nullable: false,
		example: faker.internet.url(),
	})
	@Type(() => String)
	baseUrl: string;

	@ApiProperty({
		required: true,
		nullable: false,
		example: faker.system.mimeType(),
	})
	@Type(() => String)
	mime: string;

	@ApiProperty({
		required: false,
		nullable: true,
	})
	duration?: number;

	@ApiProperty({
		required: true,
		nullable: false,
	})
	size: number;
}
