import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class FileCommomRequestDto {
  @IsNumber()
  @ApiProperty({
    description: '파일 ID',
    example: 1,
  })
  id: number;

  @IsString()
  @ApiProperty({
    description: '파일 URL',
    example: 'https://example.com/photo.jpg',
  })
  url: string;
}
