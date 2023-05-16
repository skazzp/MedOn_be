import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { AvailabilityDto } from './availability.dto';

export class UpdateAvailabilityBody {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AvailabilityDto)
  toDelete: AvailabilityDto[];

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AvailabilityDto)
  toCreate: AvailabilityDto[];

  @IsString()
  @IsNotEmpty()
  timezone: string;
}
