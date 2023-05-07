import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  Request,
  HttpStatus,
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
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.RemoteDoctor)
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

  @ApiOperation({ summary: 'Get a list of all availabilities' })
  @Get()
  async findAll(
    @Request() req: AvailabilityReq,
    @Body() dto: { timezone: string },
  ): Promise<IServerResponse<Availability[]>> {
    const availabilities =
      await this.availabilityService.findAvailabilitiesForLastThreeMonths(
        req.user.userId,
        dto.timezone,
      );
    return {
      statusCode: HttpStatus.OK,
      message: 'Availabilities were found',
      data: availabilities,
    };
  }

  @ApiOperation({ summary: 'Get an availability by Day' })
  @Get('day')
  async getByDay(
    @Body() dto: { day: string; timezone: string },
  ): Promise<IServerResponse<Availability[]>> {
    const availabilities = await this.availabilityService.getAvailabilityByDay(
      dto.day,
      dto.timezone,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Availabilities were found',
      data: availabilities,
    };
  }

  @ApiOperation({ summary: "Remove an availability by array of ID's " })
  @Delete()
  async remove(@Body() dto: { id: number[] }): Promise<IServerResponse<void>> {
    await this.availabilityService.remove(dto.id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Availabilities were removed',
    };
  }
}
