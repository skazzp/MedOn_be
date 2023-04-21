import { HttpStatus } from '@nestjs/common';

export interface IServerResponse<T = undefined> {
  statusCode: HttpStatus;
  message?: string;
  data?: T;
}
