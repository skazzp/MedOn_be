import {
  Controller,
  Post,
  Body,
  Delete,
  UseGuards,
  Request,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { Roles } from '@decorators/roles.decorator';

import { Availability } from '@entities/Availability';

import { Role } from '@common/enums';
import { AvailabilityReq } from '@common/interfaces/Availability';
import { IServerResponse } from '@common/interfaces/serverResponses';

import { RolesGuard } from '@guards/roles.guard';

import { AvailabilityService } from './availability.service';
import { ChangeAvailabilityBody } from './dto/change-availability.dto';
import { UpdateAvailabilityBody } from './dto/update-availability.dto';

@ApiTags('availability')
@UseGuards(AuthGuard('jwt'))
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.RemoteDoctor)
  @ApiOperation({ summary: 'Create a new availability' })
  @ApiResponse({
    status: 201,
    description: 'Availability was created',
  })
  @Post()
  async create(
    @Body() data: ChangeAvailabilityBody,
    @Request() req: AvailabilityReq,
  ): Promise<IServerResponse<Availability[]>> {
    await this.availabilityService.createMultiples(
      data.dto,
      data.timezone,
      req.user.userId,
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Availability was created',
    };
  }

  @ApiOperation({ summary: 'Get a list of all availabilities' })
  @ApiResponse({
    status: 200,
    description: 'Availabilities were found',
  })
  @Post('all')
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
  @ApiResponse({
    status: 200,
    description: 'Availabilities were found',
  })
  @Post('day')
  async getByDay(
    @Body() dto: { timezone: string; day: Date },
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

  @UseGuards(RolesGuard)
  @Roles(Role.RemoteDoctor)
  @ApiOperation({ summary: "Remove an availability by array of ID's " })
  @ApiResponse({
    status: 204,
    description: 'Availabilities were removed',
  })
  @Delete()
  async remove(
    @Body() data: ChangeAvailabilityBody,
    @Request() req: AvailabilityReq,
  ): Promise<IServerResponse<void>> {
    await this.availabilityService.remove(
      data.dto,
      data.timezone,
      req.user.userId,
    );
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Availabilities were removed',
    };
  }

  @UseGuards(RolesGuard)
  @Roles(Role.RemoteDoctor)
  @ApiOperation({ summary: 'Update an availability by array' })
  @ApiResponse({
    status: 200,
    description: 'Availabilities were updated',
  })
  @Patch()
  async updateMultiples(
    @Body() data: UpdateAvailabilityBody,
    @Request() req: AvailabilityReq,
  ): Promise<IServerResponse<Availability[]>> {
    const availabilities = await this.availabilityService.updateMultiples(
      data.toDelete,
      data.toCreate,
      data.timezone,
      req.user.userId,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Availabilities were updated',
      data: availabilities,
    };
  }
}
