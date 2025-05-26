import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class FileCreateRequestDto {
  @IsString()
  @ApiProperty({
    description: '대상 테이블',
    example: 'user',
  })
  targetTable: string;

  @IsNumber()
  @ApiProperty({
    description: '대상 ID',
    example: 1,
  })
  targetId?: number;

  @IsString()
  @ApiProperty({
    description: '파일 타입',
    example: 'profile',
  })
  type: string;

  @IsNumber()
  @ApiProperty({
    description: '업로더 ID',
    example: 1,
  })
  uploaderId: number;

  @IsString()
  @ApiProperty({
    description: '파일 URL',
    example: 'https://example.com/photo.jpg',
  })
  url: string;

  @IsString()
  @ApiProperty({
    description: '파일 원본 이름',
    example: 'photo.jpg',
  })
  originalName: string;

  @IsString()
  @ApiProperty({
    description: '파일 타입',
    example: 'image/jpeg',
  })
  mimeType: string;

  @IsNumber()
  @ApiProperty({
    description: '파일 크기',
    example: 100,
  })
  size: number;
}
