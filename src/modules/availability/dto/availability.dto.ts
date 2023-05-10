import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class AvailabilityDto {
  @ApiProperty({
    description: 'availability start',
    example: '2023-10-01T21:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  startTime: Date;

  @ApiProperty({
    description: 'availability end',
    example: '2023-10-01T23:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  endTime: Date;

  @ApiProperty({
    description: 'title of the availability',
    example: '08:40:23 - 10:40:23',
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  title?: string;
}
