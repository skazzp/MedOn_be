import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'Link to the appointment',
    example: 'https://example.com/appointment/123',
  })
  @IsString()
  link: string;

  @ApiProperty({
    description: 'Start time of the appointment',
    example: '2023-05-20 09:00:00',
  })
  @IsString()
  @IsNotEmpty()
  startTime: Date;

  @ApiProperty({
    description: 'End time of the appointment',
    example: '2023-05-20 10:00:00',
  })
  @IsString()
  @IsNotEmpty()
  endTime: Date;

  @ApiProperty({
    description: 'ID of the local doctor',
    example: 3,
  })
  @IsNumber()
  @IsNotEmpty()
  localDoctorId: number;

  @ApiProperty({
    description: 'ID of the remote doctor',
    example: 14,
  })
  @IsNumber()
  @IsNotEmpty()
  remoteDoctorId: number;

  @ApiProperty({
    description: 'ID of the patient',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  patientId: number;
}
