import { SignupDoctorDto } from '@modules/auth/dto/signup-doctor.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(SignupDoctorDto) {}
