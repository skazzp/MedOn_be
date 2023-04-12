import { HttpStatus } from '@nestjs/common';

export interface IServerResponse {
  statusCode: HttpStatus;
  message: string;
}
