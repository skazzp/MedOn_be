import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from '@decorators/roles.decorator';
import { Role } from '@common/enums';
import { AvailabilityReq } from '@common/interfaces/Availability';

import { RolesGuard } from 'src/guards/roles.guard';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@ApiTags('availability')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('jwt')
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.RemoteDoctor)
  @ApiOperation({ summary: 'Create a new availability' })
  @Post()
  create(
    @Body() createAvailabilityDto: CreateAvailabilityDto[],
    @Request() req: AvailabilityReq,
  ) {
    return this.availabilityService.createMultiples(
      createAvailabilityDto,
      +req.user.userId,
    );
  }

  @ApiOperation({ summary: 'Get a list of all availabilities' })
  @Get()
  findAll(@Request() req: AvailabilityReq, @Body() dto: { timezone: string }) {
    return this.availabilityService.findAvailabilities(
      +req.user.userId,
      dto.timezone,
    );
  }

  @ApiOperation({ summary: 'Get an availability by Day' })
  @Get('day')
  getByDay(@Body() dto: { day: string; timezone: string }) {
    return this.availabilityService.getAvailabilityByDay(dto.day, dto.timezone);
  }

  @ApiOperation({ summary: "Remove an availability by array of ID's " })
  @Delete()
  remove(@Body() dto: { id: number[] }) {
    return this.availabilityService.remove(dto.id);
  }
}
