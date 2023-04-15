import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgetPasswordDoctorDto {
  @ApiProperty({
    description: 'Email of the doctor',
    example: 'dr-jenner@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
