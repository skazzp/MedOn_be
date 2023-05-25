import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class ChangeAvailabilityFlagDto {
  @ApiProperty({ description: 'Start time', example: '2023-05-24T03:00:00' })
  @IsNotEmpty()
  @IsDateString()
  startTime: Date;

  @ApiProperty({ description: 'End time', example: '2023-05-24T04:00:00' })
  @IsNotEmpty()
  @IsDateString()
  endTime: Date;

  @ApiProperty({ description: 'Doctor ID', example: 37 })
  @IsNotEmpty()
  @IsNumber()
  doctorId: number;
}
