import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumberString, IsOptional } from 'class-validator';

export class PaginationOptionsDto {
  @ApiProperty({
    description: 'start of the pagination',
    example: 0,
  })
  @IsOptional()
  @IsNumberString()
  offset?: number;

  @ApiProperty({
    description: 'Quantity per click',
    example: 15,
  })
  @IsOptional()
  @IsNumberString()
  limit?: number;

  @ApiProperty({
    description: 'Show all appointments',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  showAll?: boolean;
}
