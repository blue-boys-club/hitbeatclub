import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';

export class FileMultipleResponseDto {
  @ApiProperty({
    required: true,
    example: faker.number.int(),
  })
  readonly id: number;

  @ApiProperty({
    required: true,
    example: faker.internet.url(),
  })
  readonly url: string;
}
