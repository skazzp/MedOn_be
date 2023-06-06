import { ShowAll } from '@common/enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class AllPaginationCalendarOptionsDto {
  @ApiProperty({
    description: 'Show all appointments',
    enum: ShowAll,
    example: 'true',
  })
  @IsEnum(ShowAll)
  @IsOptional()
  showAll?: ShowAll;
}
