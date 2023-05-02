import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class GetNotesParam {
  @IsInt()
  @Type(() => Number)
  id: number;
}
