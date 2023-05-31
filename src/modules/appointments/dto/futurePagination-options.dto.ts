import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class FuturePaginationOptionsDto {
  @ApiProperty({
    description: 'Quantity per click',
    example: 15,
  })
  @IsOptional()
  @IsNumberString()
  limit?: number;

  @ApiProperty({
    description: 'Offset of the pagination',
    example: 0,
  })
  @IsOptional()
  @IsNumberString()
  offset?: number;
}
