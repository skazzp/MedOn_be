import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDoctorDto {
  @ApiProperty({
    description: "Doctor's email",
    example: 'dr-jenner@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Doctor's password",
    example: 'TyuiOp123!',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
