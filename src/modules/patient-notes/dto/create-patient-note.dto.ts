import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
} from 'class-validator';

import { maxNoteLength } from '@common/constants/validation';

export class CreatePatientNoteDto {
  @ApiProperty({
    description: "Patient's note",
    example: 'Patient broke his leg',
  })
  @IsString()
  @MaxLength(maxNoteLength)
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
