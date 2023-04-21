import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Gender } from '@common/enums';

export class CreatePatientDto {
  @ApiProperty({ description: "Patient's first name", example: 'Adam' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z]+$/, {
    message: 'Incorrect first name!',
  })
  firstName: string;

  @ApiProperty({ description: "Patient's last name", example: 'Smith' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z]+$/, {
    message: 'Incorrect last name!',
  })
  lastName: string;

  @ApiProperty({
    description: 'Email of the patient',
    example: 'alex@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: "Patient's gender", example: 'male' })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty({
    description: "Patient's date of birth",
    example: '1985-04-11',
  })
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: Date;

  @ApiProperty({
    description: "Patient's country",
    example: 'USA',
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    description: "Patient's city",
    example: 'Kingston',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'Phone number of the patient',
    example: '380991201212',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{0,14}$/, {
    message: 'Incorrect phone number!',
  })
  phoneNumber: string;

  @ApiProperty({
    description: "Patient's overview",
    example: 'Allergy to ambrosia',
  })
  @IsString()
  @IsOptional()
  overview: string;
}
