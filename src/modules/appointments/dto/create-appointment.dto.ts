import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'Date of the appointment',
    example: '2023-05-20 15:53:23',
  })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'Time of the appointment',
    example: '09:00-10:00',
  })
  @IsString()
  @IsNotEmpty()
  time: string;

  @ApiProperty({
    description: 'ID of the doctor',
    example: 3,
  })
  @IsNumber()
  @IsNotEmpty()
  doctorId: number;
}
