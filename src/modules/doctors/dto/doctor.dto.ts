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

export class DoctorDto {
  @ApiProperty({ description: "Doctor's first name", example: 'Edward' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: "Doctor's last name", example: 'Jenner' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Email of the doctor',
    example: 'dr-jenner@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Doctor's password",
    example: 'TyuiOp123!',
  })
  @MinLength(6)
  @IsString()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak!',
  })
  password: string;

  @ApiProperty({
    description: "Doctor's date of birth",
    example: '1985-04-11',
  })
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: Date;

  @ApiProperty({ description: "Doctor's role", example: 'local' })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @ApiProperty({ description: "Doctor's time zone", example: 'Europe/Paris' })
  @IsString()
  @IsNotEmpty()
  timeZone: string;

  @ApiProperty({ description: "Doctor's speciality Id", example: 1 })
  @IsInt()
  @IsNotEmpty()
  specialityId: number;
}
