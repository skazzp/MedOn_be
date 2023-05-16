import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { AvailabilityDto } from './availability.dto';

export class ChangeAvailabilityBody {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AvailabilityDto)
  dto: AvailabilityDto[];

  @IsString()
  @IsNotEmpty()
  timezone: string;
}
