import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from 'src/common/enums/Gender';

export class PatientDto {
  @ApiProperty({ description: 'First name of the patients', example: 'Adam' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Last name of the patients', example: 'Smith' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Email of the patients',
    example: 'adam@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Date of birth of the patients',
    example: '1985-03-28',
  })
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: Date;

  @ApiProperty({ description: "Patient's gender", example: 'male' })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty({
    description: "Patient's address",
    example: 'Germany 21300, Frankfurt, Sudstr. 19 ',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: "Patient's phone number",
    example: '+380992141657',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: "Patient's medical history",
    example: 'Has allergy to ambrosia',
  })
  @IsString()
  @IsNotEmpty()
  overview: string;
}
