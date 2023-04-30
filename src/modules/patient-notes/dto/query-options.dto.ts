import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class NotesSearchOptionsDto {
  @ApiProperty({
    description: 'Page number',
    example: 1,
  })
  @IsOptional()
  @IsNumberString()
  page?: number;

  @ApiProperty({
    description: 'Quantity per page',
    example: 5,
  })
  @IsOptional()
  @IsNumberString()
  limit?: number;

  @ApiProperty({
    description: 'Text to search for',
    example: 'leg',
  })
  @IsString()
  @IsOptional()
  text?: string;

  @ApiProperty({
    description: 'Order',
    example: 'ASC | DESC',
  })
  @IsString()
  @IsOptional()
  order?: 'DESC' | 'ASC';
}
