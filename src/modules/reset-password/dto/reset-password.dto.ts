import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Email of the doctor',
    example: 'adam@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
