import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class PatientSearchOptionsDto {
  @ApiProperty({
    description: 'Page number',
    example: 1,
  })
  @IsOptional()
  @IsNumberString()
  page?: number;

  @ApiProperty({
    description: 'Quantity per page',
    example: 5,
  })
  @IsOptional()
  @IsNumberString()
  limit?: number;

  @ApiProperty({
    description: 'First/Last name to search for',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  searchPhrase?: string;
}
