import {
  Controller,
  Get,
  Patch,
  HttpStatus,
  Request,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import {
  IProfileRequest,
  IProfileResponse,
  IUpdateProfileResponse,
} from '@common/interfaces/userProfileResponses';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('user')
@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Request user profile' })
  @ApiResponse({
    status: 200,
    description: 'User information retrieved',
  })
  @ApiResponse({
    status: 403,
    description: 'User information request was rejected',
  })
  async getUser(@Request() req: IProfileRequest): Promise<IProfileResponse> {
    const user = await this.userService.getUser({ email: req.user?.email });
    return {
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  @Patch('update')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 201,
    description: 'User information updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'User information request was rejected',
  })
  async updateUser(
    @Request() req: IProfileRequest,
    @Body() dto: UpdateUserDto,
  ): Promise<IUpdateProfileResponse> {
    await this.userService.updateUser(req.user?.userId, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'User was updated',
    };
  }
}
