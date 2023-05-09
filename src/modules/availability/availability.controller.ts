import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  Request,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { Roles } from '@decorators/roles.decorator';

import { Availability } from '@entities/Availability';

import { Role } from '@common/enums';
import { AvailabilityReq } from '@common/interfaces/Availability';
import { IServerResponse } from '@common/interfaces/serverResponses';

import { RolesGuard } from '@guards/roles.guard';

import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@ApiTags('availability')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('jwt')
@Roles(Role.RemoteDoctor)
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create a new availability' })
  @Post()
  async create(
    @Body() dto: CreateAvailabilityDto[],
    @Request() req: AvailabilityReq,
  ): Promise<IServerResponse<Availability[]>> {
    await this.availabilityService.createMultiples(dto, req.user.userId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Availability was created',
    };
  }

  @UseGuards(RolesGuard)
  @Roles(Role.RemoteDoctor)
  @ApiOperation({ summary: 'Get a list of all availabilities' })
  @Get(':timezone')
  async findAll(
    @Request() req: AvailabilityReq,
    @Param('timezone') timezone: string,
  ): Promise<IServerResponse<Availability[]>> {
    const availabilities =
      await this.availabilityService.findAvailabilitiesForLastThreeMonths(
        req.user.userId,
        timezone,
      );
    return {
      statusCode: HttpStatus.OK,
      message: 'Availabilities were found',
      data: availabilities,
    };
  }

  @UseGuards(RolesGuard)
  @Roles(Role.RemoteDoctor)
  @ApiOperation({ summary: 'Get an availability by Day' })
  @Get(':day/:timezone')
  async getByDay(
    @Param('day') day: string,
    @Param('timezone') timezone: string,
  ): Promise<IServerResponse<Availability[]>> {
    const availabilities = await this.availabilityService.getAvailabilityByDay(
      day,
      timezone,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Availabilities were found',
      data: availabilities,
    };
  }

  @UseGuards(RolesGuard)
  @Roles(Role.RemoteDoctor)
  @ApiOperation({ summary: "Remove an availability by array of ID's " })
  @Delete()
  async remove(
    @Body() dto: { startTime: Date; endTime: Date }[],
    @Request() req: AvailabilityReq,
  ): Promise<IServerResponse<void>> {
    await this.availabilityService.remove(dto, req.user.userId);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Availabilities were removed',
    };
  }
}
