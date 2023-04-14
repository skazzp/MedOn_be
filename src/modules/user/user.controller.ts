import {
  Controller,
  Get,
  Patch,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import {
  IProfileRequest,
  IProfileResponse,
} from '@common/interfaces/userProfileResponses';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
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

  @UseGuards(AuthGuard('jwt'))
  @Patch('update')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'User information updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'User information request was rejected',
  })
  async updateUser(@Request() req: IProfileRequest): Promise<IProfileResponse> {
    const user = await this.userService.getUser({ email: req.user?.email });
    return {
      statusCode: HttpStatus.OK,
      data: user,
    };
  }
}
