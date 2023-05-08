import { PartialType } from '@nestjs/swagger';
import { CreatePatientDto } from '@modules/patients/dto/create-patient.dto';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {}
