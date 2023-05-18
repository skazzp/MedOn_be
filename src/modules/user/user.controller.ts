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
  IUpdateProfile,
} from '@common/interfaces/userProfileResponses';
import { IServerResponse } from '@common/interfaces/serverResponses';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '@modules/auth/auth.service';
import { UserService } from '@modules/user/user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPasswordDto } from './dto/updateUser.dto';

@ApiTags('user')
@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) { }

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
  ): Promise<IServerResponse<IUpdateProfile>> {
    const userData = await this.userService.updateUser(req.user?.userId, dto);
    return {
      statusCode: HttpStatus.OK,
      data: userData,
    };
  }

  @Patch('update-password')
  @ApiOperation({ summary: 'Update user password' })
  @ApiResponse({
    status: 201,
    description: 'User password updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'User password request was rejected',
  })
  async updatePassword(
    @Request() req: IProfileRequest,
    @Body() dto: UpdateUserPasswordDto,
  ): Promise<IServerResponse> {
    await this.userService.updatePassword(
      {
        email: req.user?.email,
      },
      {
        currentPassword: dto.currentPassword,
        newPassword: dto.newPassword,
      },
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Password was updated',
    };
  }
}
