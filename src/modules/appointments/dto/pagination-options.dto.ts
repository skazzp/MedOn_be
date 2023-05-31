import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class PaginationOptionsDto {
  @ApiProperty({
    description: 'start of the pagination',
    example: 1,
  })
  @IsOptional()
  @IsNumberString()
  offset?: number;

  @ApiProperty({
    description: 'Quantity per click',
    example: 5,
  })
  @IsOptional()
  @IsNumberString()
  limit?: number;
}
