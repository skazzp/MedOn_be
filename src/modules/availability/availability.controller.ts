import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { Roles } from '@decorators/roles.decorator';
import { Role } from '@common/enums';
import { RolesGuard } from 'src/guards/roles.guard';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';

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
  create(@Body() createAvailabilityDto: CreateAvailabilityDto) {
    return this.availabilityService.create(createAvailabilityDto);
  }

  @ApiOperation({ summary: 'Get a list of all availabilities' })
  @Get()
  findAll() {
    return this.availabilityService.findAll();
  }

  @ApiOperation({ summary: 'Get an availability by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the availability' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.availabilityService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update an availability by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the availability' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAvailabilityDto: UpdateAvailabilityDto,
  ) {
    return this.availabilityService.update(+id, updateAvailabilityDto);
  }

  @ApiOperation({ summary: 'Remove an availability by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the availability' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.availabilityService.remove(+id);
  }
}
