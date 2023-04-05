import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsDateString,
  IsEnum,
  MinLength,
  Matches,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../common/enums/Role';

export class ReconfirmDoctorDto {
  @ApiProperty({
    description: 'Email of the doctor',
    example: 'dr-jenner@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
