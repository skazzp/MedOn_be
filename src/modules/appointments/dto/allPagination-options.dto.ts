import { Filter, ShowAll } from '@common/enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional } from 'class-validator';

export class AllPaginationOptionsDto {
  @ApiProperty({
    description: 'page of the pagination',
    example: '1',
  })
  @IsNumberString()
  page: number;

  @ApiProperty({
    description: 'Show all appointments',
    enum: ShowAll,
    example: true,
  })
  @IsEnum(ShowAll)
  @IsOptional()
  showAll?: ShowAll;

  @ApiProperty({
    description: 'Filter for appointments',
    enum: Filter,
    example: Filter.future,
  })
  @IsEnum(Filter)
  filter: Filter;
}
