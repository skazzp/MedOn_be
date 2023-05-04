import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateAvailabilityDto {
  @ApiProperty({
    description: 'availability start',
    example: '01/02/2021, 08:40:23',
  })
  @IsDateString()
  @IsNotEmpty()
  startTime: Date;

  @ApiProperty({
    description: 'availability end',
    example: '01/02/2021, 10:40:23',
  })
  @IsDateString()
  @IsNotEmpty()
  endTime: Date;

  @ApiProperty({
    description: 'title of the availability',
    example: '08:40:23 - 10:40:23',
  })
  @IsNotEmpty()
  @IsString()
  title: string;
}
