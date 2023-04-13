import { Doctor } from '@entities/Doctor';
import { HttpStatus } from '@nestjs/common';

export interface IProfileResponse {
  statusCode: HttpStatus;
  data: Doctor;
}
