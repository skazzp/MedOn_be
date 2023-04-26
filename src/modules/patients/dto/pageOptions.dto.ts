import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PageOptionsDto {
  @ApiProperty({
    description: 'Page number',
    example: 1,
  })
  @IsString()
  @IsOptional()
  page: number;

  @ApiProperty({
    description: 'Quantity per page',
    example: 5,
  })
  @IsString()
  @IsOptional()
  limit: number;

  @ApiProperty({
    description: 'First/Last name to search for',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  name: string;
}
