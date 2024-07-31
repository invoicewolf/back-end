import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FirebaseService } from '@speakbox/nestjs-firebase-admin';
import { CreateUserDto } from './dto/create-user.dto';
import { ProfileDto } from './dto/profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Post('/')
  @ApiOkResponse({ type: UserDto })
  @ApiOperation({
    operationId: 'createUser',
  })
  createUser(
    @Req() request: Request,
    @Body(new ValidationPipe()) user: CreateUserDto,
  ) {
    this.firebaseService.auth
      .getUserByEmail(request['user'].email)
      .then((user) => {
        return this.firebaseService.auth.setCustomUserClaims(user.uid, {
          roles: ['user'],
        });
      })
      .catch((e) => {
        console.error(e);
      });

    return this.usersService.createUser(user);
  }

  @Delete('/me')
  @ApiOkResponse({ type: UserDto })
  @ApiOperation({
    operationId: 'deleteCurrentUser',
  })
  deleteCurrentUser(@Req() request: Request) {
    const requestUser = request['user'].user_id;

    this.firebaseService.auth.deleteUser(requestUser);

    return this.usersService.deleteUser(requestUser);
  }

  @Put('/me')
  @ApiOkResponse({ type: UserDto })
  @ApiOperation({
    operationId: 'updateCurrentUser',
  })
  updateCurrentUser(
    @Req() request: Request,
    @Body(new ValidationPipe()) user: UpdateUserDto,
  ) {
    const requestUser = request['user'].user_id;

    return this.usersService.updateUser(requestUser, user);
  }

  @Get('/me')
  @ApiOkResponse({ type: UserDto })
  @ApiOperation({
    operationId: 'getCurrentUser',
  })
  getCurrentUser(@Req() request: Request) {
    const requestUser = request['user'].user_id;

    return this.usersService.findUser(requestUser);
  }

  @Get('/me/profile')
  @ApiOkResponse({ type: ProfileDto })
  @ApiOperation({
    operationId: 'getCurrentUserProfile',
  })
  getProfile(@Req() request: Request) {
    const userId = request['user'].user_id;

    return this.usersService.getProfile(userId);
  }
}
