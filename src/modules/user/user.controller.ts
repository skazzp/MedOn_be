import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { IProfileResponse } from '@common/interfaces/userProfileResponses';
import { AuthGuard } from '@modules/auth/auth.guard';
import { IResetPasswordRequest } from '@common/interfaces/resetPasswordRequest';
import { IServerResponse } from '@common/interfaces/serverResponses';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
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
  async getUser(
    @Request() req: IResetPasswordRequest,
  ): Promise<IProfileResponse> {
    const user = await this.userService.getUser({ email: req.doctor?.email });
    return {
      statusCode: HttpStatus.OK,
      data: user,
    };
  }
}
