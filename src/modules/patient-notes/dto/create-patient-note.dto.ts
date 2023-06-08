import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
} from 'class-validator';

import { maxTextareaLength } from '@common/constants/validation';

export class CreatePatientNoteDto {
  @ApiProperty({
    description: "Patient's note",
    example: 'Patient broke his leg',
  })
  @IsString()
  @MaxLength(maxTextareaLength)
  @IsNotEmpty()
  note: string;

  @ApiProperty({
    description: "Patient's ID",
    example: '2',
  })
  @IsNumberString()
  @IsNotEmpty()
  patientId: number;
}
