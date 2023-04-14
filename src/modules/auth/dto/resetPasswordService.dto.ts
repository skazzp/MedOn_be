import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ResetPasswordDoctorDto } from './resetPasswordController.dto';

export class ResetPasswordServiceDoctorDto extends ResetPasswordDoctorDto {
  @ApiProperty({
    description: 'Email of the doctor',
    example: 'dr-jenner@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
