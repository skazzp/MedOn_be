import { Filter } from '@common/enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumberString, IsOptional } from 'class-validator';

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

  @ApiProperty({
    description: 'Filter for appointments',
    enum: Filter,
    example: Filter.future,
  })
  @IsEnum(Filter)
  @IsOptional()
  filter?: Filter;
}
